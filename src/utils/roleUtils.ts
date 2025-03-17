import { User, UserAPI } from "@/models/UserModel";
import { Role, RoleAPI } from "@/models/RoleModel";
import { AppPermissionType } from "@/config/permissions";

/**
 * Returns the role with the HIGHEST numeric level that has the specified permission.
 * E.g., if level=100 is the highest authority, this returns the role with the largest level.
 */
export function getHighestRoleWithPermission(
  user: UserAPI | User | null,
  permission: AppPermissionType
): RoleAPI | Role | null {
  if (!user?.roles?.length) return null;

  // Filter roles that include the permission
  const rolesWithPermission = user.roles.filter((role) =>
    role.permissions.includes(permission)
  );
  if (rolesWithPermission.length === 0) return null;

  // Return the role with the LARGEST level (i.e. highest authority).
  return rolesWithPermission.reduce((highest, role) =>
    role.level > highest.level ? role : highest
  );
}
