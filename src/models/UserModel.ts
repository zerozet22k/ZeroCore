import mongoose, { Document, Schema, Types } from "mongoose";
import { Role, RoleAPI } from "./RoleModel";
import { roleModelName, usersModelName } from ".";
import {
  DeviceToken,
  DeviceTokenAPI,
  deviceTokenSchema,
} from "./Users/DeviceToken";

interface BaseUser {
  name?: string;
  bio?: string;
  username: string;
  email: string;
  password?: string;
  hashedPassword: string;
  salt: string;
  created_at: Date;
  updated_at: Date;
  avatar: string;
  cover_image?: string;
  phones?: { type: string; number: string }[];
  position?: string;
}

export interface User extends BaseUser, Document {
  _id: Types.ObjectId;
  role_ids: Types.ObjectId[];
  roles: Role[];
  devices: DeviceToken[];
}

export interface UserAPI extends BaseUser {
  _id: string;
  role_ids: string[];
  roles: RoleAPI[];
  devices: DeviceTokenAPI[];
}

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },

    avatar: { type: String, default: "/images/default-avatar.webp" },

    cover_image: { type: String, default: "/images/team-banner.jpg" },

    phones: [
      {
        type: {
          type: String,
          enum: ["Work", "Mobile", "Fax", "Home", "Other"],
          required: true,
        },
        number: { type: String, required: true, trim: true },
      },
    ],

    position: { type: String, trim: true },

    role_ids: [{ type: Schema.Types.ObjectId, ref: roleModelName }],
    devices: [deviceTokenSchema],
  },
  { timestamps: true }
);

userSchema.virtual("roles", {
  ref: roleModelName,
  localField: "role_ids",
  foreignField: "_id",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User =
  mongoose.models?.[usersModelName] ||
  mongoose.model<User>(usersModelName, userSchema);

export default User;
