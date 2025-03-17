import { Schema, Types } from "mongoose";

interface BaseDeviceToken {
  deviceName: string;
  token: string;
  createdAt: Date;
}

export interface DeviceToken extends BaseDeviceToken {
  _id?: Types.ObjectId;
}

export interface DeviceTokenAPI extends BaseDeviceToken {
  _id?: string;
}
export const deviceTokenSchema = new Schema({
  deviceName: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
