import { APP_PERMISSIONS, AppPermissionType } from "@/config/permissions";
import mongoose, { Schema, Document, Types } from "mongoose";
import { roleModelName } from ".";

export enum RoleType {
  SYSTEM = "system",
  GUEST = "guest",
  CUSTOM = "custom",
}

interface BaseRole {
  name: string;
  type: RoleType;
  permissions: AppPermissionType[];
  color: string;
  nonDeletable: boolean;
  nonPermissionsEditable: boolean;
  level: number;
}

export interface Role extends BaseRole, Document {
  _id: Types.ObjectId;
}

export interface RoleAPI extends BaseRole {
  _id: string;
}

const roleSchema = new Schema<Role>({
  name: { type: String, unique: true, required: true },
  type: {
    type: String,
    enum: Object.values(RoleType),
    default: RoleType.CUSTOM,
  },
  permissions: {
    type: [String],
    enum: Object.values(APP_PERMISSIONS),
    default: [],
  },
  color: { type: String, required: true },
  nonDeletable: { type: Boolean, default: false },
  nonPermissionsEditable: { type: Boolean, default: false },
  level: { type: Number, required: true, default: 1, min: 1, max: 100 },
});

const RoleModel =
  mongoose.models?.[roleModelName] ||
  mongoose.model<Role>(roleModelName, roleSchema);

export default RoleModel;
