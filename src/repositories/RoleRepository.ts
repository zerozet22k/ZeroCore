import dbConnect from "@/db";
import RoleModel, { Role, RoleType } from "../models/RoleModel";
import { Types, Model } from "mongoose";

class RoleRepository {
  private roleModel: Model<Role>;

  constructor() {
    this.roleModel = RoleModel;
  }
  async findAll(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = []
  ): Promise<{ roles: Role[]; hasMore: boolean }> {
    await dbConnect();

    // Build query conditions based on the searchQuery.
    const queryConditions: any = {};
    if (searchQuery) {
      queryConditions.$or = [{ name: new RegExp(searchQuery, "i") }];
    }

    // Execute the main query with pagination.
    let query = this.roleModel.find(queryConditions);
    if (page !== undefined && limit !== undefined) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const searchResults = await query.exec();

    // Count total roles matching the search conditions.
    const totalMatching = await this.roleModel.countDocuments(queryConditions);
    const mainHasMore =
      page !== undefined && limit !== undefined
        ? page * limit < totalMatching
        : false;

    // Fetch roles by selected IDs, ensuring they are always included.
    let selectedDocs: Role[] = [];
    if (selected.length) {
      selectedDocs = await this.roleModel.find({ _id: { $in: selected } });
    }

    // Merge the search results and selectedDocs, removing duplicates.
    const mergedMap = new Map<string, Role>();
    for (const role of searchResults) {
      mergedMap.set(role._id.toHexString(), role);
    }
    for (const role of selectedDocs) {
      mergedMap.set(role._id.toHexString(), role);
    }
    const roles = Array.from(mergedMap.values());

    return {
      roles,
      hasMore: mainHasMore,
    };
  }

  async findById(roleId: Types.ObjectId): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findById(roleId).exec();
  }

  async findByIds(ids: Types.ObjectId[]): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find({ _id: { $in: ids } }).exec();
  }

  async findRolesAboveLevel(level: number): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find({ level: { $gt: level } }).exec();
  }

  async findRolesUpToLevel(level: number): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find({ level: { $lte: level } }).exec();
  }

  async create(roleData: Partial<Role>): Promise<Role> {
    await dbConnect();
    const role = new this.roleModel(roleData);
    return role.save();
  }

  async update(
    roleId: Types.ObjectId,
    updateData: Partial<Role>
  ): Promise<Role | null> {
    await dbConnect();
    return this.roleModel
      .findByIdAndUpdate(roleId, updateData, { new: true })
      .exec();
  }

  async delete(roleId: Types.ObjectId): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findByIdAndDelete(roleId).exec();
  }

  async updatePermissionsSystem(
    roleId: Types.ObjectId,
    permissions: string[]
  ): Promise<Role | null> {
    await dbConnect();
    return this.roleModel
      .findByIdAndUpdate(roleId, { permissions }, { new: true })
      .exec();
  }

  async findByRoleType(roleType: RoleType): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findOne({ type: roleType }).exec();
  }
}

export default RoleRepository;
