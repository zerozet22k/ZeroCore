import { User } from "../models/UserModel";
import {
  userRepository,
  roleRepository,
  cacheRepository,
  toObjectId,
} from "@/repositories";
import { Role, RoleType } from "@/models/RoleModel";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { APP_PERMISSIONS, GUEST_APP_PERMISSIONS } from "@/config/permissions";
import { DeviceToken } from "@/models/Users/DeviceToken";

class UserService {
  async getAllUsers(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: string[] = []
  ): Promise<{ users: User[]; hasMore: boolean }> {
    const selectedObjectIds = selected.map(toObjectId);
    return userRepository.findAll(searchQuery, page, limit, selectedObjectIds);
  }

  async getAuthUserByEmail(email: string): Promise<User | null> {
    return userRepository.findAuthUserByEmail(email);
  }
  async getUserByEmail(email: string): Promise<Partial<User> | null> {
    return userRepository.findByEmail(email);
  }
  async updateUserAvatar(
    userId: string,
    avatarUrl: string
  ): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.updateUserAvatar(userObjectId, avatarUrl);
  }
  async getUsersByRole(roleId: string): Promise<User[]> {
    const roleObjectId = toObjectId(roleId);
    return userRepository.findByRole(roleObjectId);
  }

  async getUserById(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.findById(userObjectId);
  }
  async getUserByIds(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.findById(userObjectId);
  }
  async setupDefaultRolesAndSystemUser(userData: Partial<User>): Promise<void> {
    let systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);

    if (!systemRole) {
      systemRole = await roleRepository.create({
        name: "System Admin",
        type: RoleType.SYSTEM,
        permissions: Object.values(APP_PERMISSIONS),
        color: "red",
        nonPermissionsEditable: true,
        level: 100,
      });
    }

    let guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    if (!guestRole) {
      guestRole = await roleRepository.create({
        name: "Guest",
        type: RoleType.GUEST,
        permissions: GUEST_APP_PERMISSIONS,
        color: "gray",
        nonPermissionsEditable: true,
        level: 1,
      });
    }

    const existingSystemUser = await userRepository.findByRoleTypeOrEmail(
      RoleType.SYSTEM,
      userData.email!
    );

    if (!existingSystemUser) {
      const { hashedPassword, salt } = this.hashPassword(userData.password!);
      userData.hashedPassword = hashedPassword;
      userData.salt = salt;
      delete userData.password;

      userData.role_ids = [systemRole._id];

      await userRepository.create(userData);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    return userRepository.create(userData);
  }

  async signup(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    const guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    if (!guestRole) {
      throw new Error("Guest role is missing. Please set up default roles.");
    }

    userData.role_ids = [guestRole._id];

    return userRepository.create(userData);
  }
  async syncRolePermissions(force: boolean = false): Promise<void> {
    const lastSyncTime = await cacheRepository.get<number>("lastRoleSyncTime");

    const ONE_HOUR = 60 * 60 * 1000;

    if (!force && lastSyncTime && Date.now() - lastSyncTime < ONE_HOUR) {
      console.log("Skipping role sync, recently updated.");
      return;
    }

    const systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);
    const guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    const updates: Promise<Role | null>[] = [];

    if (systemRole) {
      updates.push(
        roleRepository.updatePermissionsSystem(
          systemRole._id,
          Object.values(APP_PERMISSIONS)
        )
      );
    }

    if (guestRole) {
      updates.push(
        roleRepository.updatePermissionsSystem(
          guestRole._id,
          GUEST_APP_PERMISSIONS
        )
      );
    }

    await Promise.all(updates).then((results) => {
      const validRoles = results.filter((role) => role !== null);
    });

    await cacheRepository.set("lastRoleSyncTime", Date.now(), ONE_HOUR);
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    if (updateData.password) {
      const { hashedPassword, salt } = this.hashPassword(updateData.password);
      updateData.hashedPassword = hashedPassword;
      updateData.salt = salt;

      delete updateData.password;
    }

    return userRepository.update(userObjectId, updateData);
  }

  async deleteUser(userId: string): Promise<User | null> {
    const userObjectId = toObjectId(userId);
    return userRepository.delete(userObjectId);
  }
  async saveDeviceToken(
    userId: string,
    deviceName: string,
    refreshToken: string
  ): Promise<void> {
    const userObjectId = toObjectId(userId);
    return userRepository.saveDeviceToken(
      userObjectId,
      deviceName,
      refreshToken
    );
  }

  async findDeviceToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    const userObjectId = toObjectId(userId);
    return userRepository.findDeviceToken(userObjectId, refreshToken);
  }

  async deleteDeviceToken(userId: string, refreshToken: string): Promise<void> {
    const userObjectId = toObjectId(userId);
    return userRepository.deleteDeviceToken(userObjectId, refreshToken);
  }

  async getAllUserDevices(userId: string): Promise<DeviceToken[]> {
    const userObjectId = toObjectId(userId);
    return userRepository.getAllDevices(userObjectId);
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    return userRepository.findRefreshToken(refreshToken);
  }
  private hashPassword(password: string): {
    hashedPassword: string;
    salt: string;
  } {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return { hashedPassword, salt };
  }

  verifyPassword(inputPassword: string, user: User): boolean {
    const hash = crypto
      .pbkdf2Sync(inputPassword, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return user.hashedPassword === hash;
  }

  generateAccessToken(userId: string) {
    const expiresIn = "1h";
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn });

    const expirationTime = Date.now() + 3600 * 1000;

    return { token, expirationTime };
  }

  generateRefreshToken(userId: string) {
    const expiresIn = "30d";
    const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn,
    });

    const expirationTime = Date.now() + 30 * 24 * 3600 * 1000;

    return { token, expirationTime };
  }
  async purgeAllDeviceTokens(userId: string): Promise<void> {
    const userObjectId = toObjectId(userId);

    try {
      await userRepository.purgeDeviceTokensByUserId(userObjectId);
      console.log(`All device tokens for user ${userId} have been purged.`);
    } catch (error) {
      console.error(`Failed to purge device tokens for user ${userId}:`, error);
      throw new Error("Failed to purge device tokens.");
    }
  }
  async purgeAllDevices(): Promise<void> {
    try {
      await userRepository.purgeAllDeviceTokens();
      console.log("All device tokens for all users have been purged.");
    } catch (error) {
      console.error("Failed to purge device tokens for all users:", error);
      throw new Error("Failed to purge device tokens for all users.");
    }
  }
}

export default UserService;
