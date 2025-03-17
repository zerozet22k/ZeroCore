import { Role, RoleType } from "@/models/RoleModel";
import { roleRepository, toObjectId } from "@/repositories";

class RoleService {
  async getAllRoles(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: string[] = []
  ): Promise<{ roles: Role[]; hasMore: boolean }> {
    const selectedObjectIds = selected.map((id) => toObjectId(id));
    return roleRepository.findAll(searchQuery, page, limit, selectedObjectIds);
  }

  async getRoleById(roleId: string): Promise<Role | null> {
    const roleObjectId = toObjectId(roleId);
    return roleRepository.findById(roleObjectId);
  }
  async getRolesByIds(ids: string[]): Promise<Role[]> {
    const objectIds = ids.map((id) => toObjectId(id));
    return roleRepository.findByIds(objectIds);
  }
  async getRolesAboveLevel(level: number): Promise<Role[]> {
    return roleRepository.findRolesAboveLevel(level);
  }

  async getRolesUpToLevel(level: number): Promise<Role[]> {
    return roleRepository.findRolesUpToLevel(level);
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    if (roleData.type === RoleType.SYSTEM) {
      throw new Error("Cannot create new system roles.");
    }
    return roleRepository.create(roleData);
  }

  async updateRole(
    roleId: string,
    updateData: Partial<Role>
  ): Promise<Role | null> {
    const roleObjectId = toObjectId(roleId);
    const role = await roleRepository.findById(roleObjectId);
    if (!role) throw new Error("Role not found");

    if (role.type === RoleType.SYSTEM) {
      throw new Error("System roles cannot be modified.");
    }

    if (role.type === RoleType.GUEST && updateData.permissions) {
      throw new Error("Guest role permissions cannot be changed.");
    }

    return roleRepository.update(roleObjectId, updateData);
  }

  async deleteRole(roleId: string): Promise<Role | null> {
    const roleObjectId = toObjectId(roleId);
    const role = await roleRepository.findById(roleObjectId);
    if (!role) throw new Error("Role not found");

    if (role.type === RoleType.SYSTEM || role.type === RoleType.GUEST) {
      throw new Error("This role cannot be deleted.");
    }

    return roleRepository.delete(roleObjectId);
  }

  async updatePermissions(
    roleId: string,
    permissions: string[]
  ): Promise<Role | null> {
    const roleObjectId = toObjectId(roleId);
    const role = await roleRepository.findById(roleObjectId);
    if (!role) throw new Error("Role not found");

    if (role.nonPermissionsEditable) {
      throw new Error("Permissions for this role cannot be modified.");
    }

    return roleRepository.updatePermissionsSystem(roleObjectId, permissions);
  }
}

export default RoleService;
