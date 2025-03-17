import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";

const userService = new UserService();
const roleService = new RoleService();

async function handleGetAllUsersRequest(request: Request, currentUser: User) {
  try {
    const users = (await userService.getAllUsers()).users;
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateUserRequest(request: Request, currentUser: User) {
  try {
    const data = await request.json();

    if (!data.email || !data.password || !data.username) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Enforce binding restrictions if role_ids are provided.
    if (data.role_ids) {
      const highestEditableRole = getHighestRoleWithPermission(
        currentUser,
        APP_PERMISSIONS.BIND_ROLE
      );
      if (!highestEditableRole) {
        return NextResponse.json(
          { error: "You do not have permission to bind roles." },
          { status: 403 }
        );
      }
      const roles = await roleService.getRolesByIds(data.role_ids);
      if (roles.length !== data.role_ids.length) {
        return NextResponse.json(
          { error: "One or more selected roles were not found." },
          { status: 400 }
        );
      }
      // Ensure every role to be bound is strictly lower than the highestEditableRole.
      for (const role of roles) {
        if (role.level >= highestEditableRole.level) {
          return NextResponse.json(
            {
              error:
                "You cannot bind roles that are above or equal to your authority.",
            },
            { status: 403 }
          );
        }
      }
    }

    const existingUser = await userService.getAuthUserByEmail(data.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const newUser = await userService.createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, user) => handleGetAllUsersRequest(req, user), true, [
    APP_PERMISSIONS.VIEW_USERS,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleCreateUserRequest(request, user),
    true,
    [APP_PERMISSIONS.CREATE_USER]
  )(request);
