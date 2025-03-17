import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import { AppPermissionType, checkPermission } from "@/config/permissions";
import { User } from "@/models/UserModel";

const userService = new UserService();

interface AuthResult {
  user: User | null;
  token: string | null;
}

async function serverAuthMiddleware(
  requiredPermissions?: AppPermissionType[],
  checkAll: boolean = true
): Promise<AuthResult> {
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) {
    return { user: null, token: null };
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (typeof decoded !== "object" || !decoded.userId) {
      return { user: null, token: null };
    }

    const user = await userService.getUserById(decoded.userId);

    if (!user || !user.roles) {
      return { user: null, token: accessToken };
    }

    if (
      requiredPermissions?.length &&
      !checkPermission(user, requiredPermissions, checkAll)
    ) {
      throw new Error("Forbidden: Insufficient permissions");
    }

    return { user, token: accessToken };
  } catch (error) {
    console.error("Authentication Error:", error);
    throw new Error("Unauthorized: Invalid or expired token");
  }
}

export async function withServerAuth<Protected extends boolean>(
  handler: (
    user: Protected extends true ? User : User | null,
    token: string | null
  ) => Promise<any>,
  isProtected: Protected,
  requiredPermissions?: AppPermissionType[],
  checkAll: boolean = true
): Promise<any> {
  const authResult = await serverAuthMiddleware(requiredPermissions, checkAll);

  const { user, token } = authResult;

  if (isProtected && !user) {
    throw new Error("Unauthorized: User is required for this action");
  }

  return handler(user as Protected extends true ? User : User | null, token);
}
