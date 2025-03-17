import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import {
  APP_PERMISSIONS,
  AppPermissionType,
  FREE_PERMISSIONS,
} from "@/config/permissions";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";
import { User, UserAPI } from "@/models/UserModel";

const roleService = new RoleService();

async function handleGetRoleByIdRequest(
  request: Request,
  params: { id: string },
  user: User
) {
  try {
    const role = await roleService.getRoleById(params.id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateRoleRequest(
  request: Request,
  params: { id: string },
  user: User
) {
  try {
    const data = await request.json();
    // Get the highest role (by numeric level) that grants EDIT_ROLE for the current user.
    const highestEditableRole = getHighestRoleWithPermission(
      user,
      APP_PERMISSIONS.EDIT_ROLE
    );
    if (!highestEditableRole) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    // Enforce level restriction: new level must be strictly less than highestEditableRole.level.
    if (data.level >= highestEditableRole.level) {
      return NextResponse.json(
        {
          error: `Role level must be strictly less than ${highestEditableRole.level}`,
        },
        { status: 400 }
      );
    }
    // Aggregate user's permissions.
    const userPermissions = Array.from(
      new Set(user.roles.flatMap((r: any) => r.permissions))
    );
    const invalidPerms = data.permissions.filter(
      (perm: AppPermissionType) =>
        !FREE_PERMISSIONS.includes(perm) && !userPermissions.includes(perm)
    );
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        {
          error: `You cannot delegate permission(s): ${invalidPerms.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }
    const updatedRole = await roleService.updateRole(params.id, data);
    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteRoleRequest(
  request: Request,
  params: { id: string },
  user: User
) {
  try {
    await roleService.deleteRole(params.id);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error: any) {
    if (error.message === "This role cannot be deleted.") {
      return NextResponse.json(
        { error: "This role type cannot be deleted." },
        { status: 400 }
      );
    }
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGetRoleByIdRequest(req, context.params, user),
    true,
    [APP_PERMISSIONS.VIEW_ROLES]
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleUpdateRoleRequest(req, context.params, user),
    true,
    [APP_PERMISSIONS.EDIT_ROLE]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleDeleteRoleRequest(req, context.params, user),
    true,
    [APP_PERMISSIONS.DELETE_ROLE]
  )(request);
