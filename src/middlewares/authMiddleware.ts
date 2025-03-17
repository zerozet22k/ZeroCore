import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import {
  AppPermissionType,
  checkPermission,
} from "@/config/permissions";
import { User } from "@/models/UserModel";

const userService = new UserService();

async function authMiddleware(
  request: Request,
  requiredPermissions?: AppPermissionType[],
  checkAll: boolean = true
): Promise<{ user: User | null } | NextResponse> {
  let userId: string | null = null;
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (typeof decoded === "object" && decoded.userId) {
        userId = decoded.userId;
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  if (!userId) {
    return { user: null };
  }

  try {
    const user = await userService.getUserById(userId);
    if (!user || !user.roles) {
      return { user: null };
    }

    if (
      requiredPermissions?.length &&
      !checkPermission(user, requiredPermissions, checkAll)
    ) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function withAuthMiddleware<Protected extends boolean>(
  routeHandler: (
    request: Request,
    user: Protected extends true ? User : User | null
  ) => Promise<NextResponse>,
  isProtected: Protected,
  requiredPermissions?: AppPermissionType[],
  checkAll: boolean = true
): (request: Request) => Promise<NextResponse> {
  return async (request: Request): Promise<NextResponse> => {
    const authResult = await authMiddleware(
      request,
      requiredPermissions,
      checkAll
    );

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    if (isProtected && !user) {
      return NextResponse.json(
        { error: "Unauthorized: User is required for this action" },
        { status: 401 }
      );
    }

    return routeHandler(
      request,
      user as Protected extends true ? User : User | null
    );
  };
}
