import dbConnect from "@/db";
import UserModel, { User } from "../models/UserModel";
import { Types, Model } from "mongoose";
import { roleRepository } from ".";
import { RoleType } from "@/models/RoleModel";
import { DeviceToken } from "@/models/Users/DeviceToken";

class UserRepository {
  private userModel: Model<User>;

  constructor() {
    this.userModel = UserModel;
  }
  async findAuthUserByEmail(email: string): Promise<User | null> {
    await dbConnect();
    return this.userModel.findOne({ email }).populate("roles").exec();
  }
  async findAll(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = []
  ): Promise<{ users: User[]; hasMore: boolean }> {
    await dbConnect();

    const queryConditions: any = {};

    if (selected.length) {
      queryConditions._id = { $in: selected };
    }

    if (searchQuery) {
      queryConditions.$or = [
        { name: new RegExp(searchQuery, "i") },
        { username: new RegExp(searchQuery, "i") },
        { email: new RegExp(searchQuery, "i") },
      ];
    }

    let query = this.userModel.find(queryConditions);

    if (page !== undefined && limit !== undefined) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const users = await query
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();

    const totalUsers = await this.userModel.countDocuments(queryConditions);

    return {
      users,
      hasMore:
        page !== undefined && limit !== undefined
          ? page * limit < totalUsers
          : false,
    };
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findByRole(roleId: Types.ObjectId): Promise<User[]> {
    await dbConnect();

    return this.userModel
      .find({ role_ids: { $in: [roleId] } })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    await dbConnect();
    return this.userModel
      .findOne({ email })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }
  async create(userData: Partial<User>): Promise<User> {
    await dbConnect();
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<User | null> {
    await dbConnect();

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async saveDeviceToken(
    userId: Types.ObjectId,
    deviceName: string,
    token: string
  ): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    if (!user.devices) {
      user.devices = [];
    }

    user.devices.push({ deviceName, token, createdAt: new Date() });
    await user.save();
  }

  async findDeviceToken(
    userId: Types.ObjectId,
    token: string
  ): Promise<boolean> {
    await dbConnect();
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    return user.devices.some((device) => device.token === token);
  }

  async deleteDeviceToken(
    userId: Types.ObjectId,
    token: string
  ): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { devices: { token } } })
      .exec();
  }

  async getAllDevices(userId: Types.ObjectId): Promise<DeviceToken[]> {
    await dbConnect();
    const user = await this.userModel.findById(userId).select("devices").exec();
    if (!user) throw new Error("User not found");

    return user.devices;
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    await dbConnect();

    return this.userModel.findOne({ "devices.token": refreshToken }).exec();
  }
  async findByRoleTypeOrEmail(
    roleType: RoleType,
    email: string
  ): Promise<User | null> {
    await dbConnect();

    const role = await roleRepository.findByRoleType(roleType);
    if (!role) return null;

    return this.userModel
      .findOne({
        $or: [{ role_ids: { $in: [role._id] } }, { email }],
      })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }
  async purgeDeviceTokensByUserId(userId: Types.ObjectId): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    user.devices = [];

    await user.save();
  }
  async purgeAllDeviceTokens(): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateMany({}, { $set: { devices: [] }, $unset: { tokens: "" } })
      .exec();
  }
  async updateUserAvatar(
    id: Types.ObjectId,
    avatarUrl: string
  ): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true })
      .select("avatar")
      .exec();
  }
}

export default UserRepository;
