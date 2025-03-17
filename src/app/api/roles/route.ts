import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import {
  APP_PERMISSIONS,
  AppPermissionType,
  FREE_PERMISSIONS,
} from "@/config/permissions";
import { getHighestRoleWithPermission } from "@/utils/roleUtils";

const roleService = new RoleService();

async function handleGetAllRolesRequest(user: any) {
  try {
    const roles = (await roleService.getAllRoles()).roles;
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateRoleRequest(request: Request, user: any) {
  try {
    const body = await request.json();
    const { name, type, permissions, level } = body;
    if (!name || !type || !permissions || level === undefined) {
      return NextResponse.json(
        { error: "Missing required fields (name, type, permissions, level)" },
        { status: 400 }
      );
    }
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
    if (level >= highestEditableRole.level) {
      return NextResponse.json(
        {
          error: `Role level must be strictly less than ${highestEditableRole.level}`,
        },
        { status: 400 }
      );
    }
    const userPermissions = Array.from(
      new Set(user.roles.flatMap((r: any) => r.permissions))
    );
    const invalidPerms = permissions.filter(
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
    const newRole = await roleService.createRole(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((_req, user) => handleGetAllRolesRequest(user), true, [
    APP_PERMISSIONS.VIEW_ROLES,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (_req, user) => handleCreateRoleRequest(request, user),
    true,
    [APP_PERMISSIONS.CREATE_ROLE]
  )(request);
