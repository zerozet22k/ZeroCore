import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import mongoose, { Document, Schema, Types } from "mongoose";
import { settingModelName } from ".";


interface BaseSetting {
  key: keyof SettingsInterface;
  value: SettingsInterface[keyof SettingsInterface];
  isPublic: boolean;
}

export interface Setting extends BaseSetting, Document {
  _id: Types.ObjectId;
}

export interface SettingAPI extends BaseSetting {
  _id: string;
}

const SettingSchema = new Schema<Setting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  isPublic: { type: Boolean, default: false },
});

const SettingModel =
  mongoose.models?.[settingModelName] ||
  mongoose.model(settingModelName, SettingSchema);

export default SettingModel;
