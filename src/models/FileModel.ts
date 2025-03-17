import mongoose, { Document, Schema, Types } from "mongoose";
import { fileModelName, usersModelName } from ".";
import { User, UserAPI } from "./UserModel";

export const STORAGE_SERVICES = {
  FIREBASE: "firebase",
  LOCAL: "local",
} as const;

export type StorageServiceType =
  (typeof STORAGE_SERVICES)[keyof typeof STORAGE_SERVICES];

export type FileTypeWithEmpty = FileType | "";
export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  ARCHIVE = "archive",
  CODE = "code",
  SPREADSHEET = "spreadsheet",
  PRESENTATION = "presentation",
  UNKNOWN = "unknown",
}

interface BaseFileData {
  rawFilePath: string;
  filePath?: string;
  name: string;
  type: FileType;
  size: number;
  service: StorageServiceType;
  publicUrl: string;
  description?: string;
  lastAccessed?: Date;
  isPublic: boolean;
  folder?: string;
  createdAt: Date;
}

export interface FileData extends BaseFileData, Document {
  _id: Types.ObjectId;
  uploadedByUserId: Types.ObjectId;
  uploadedByUser?: User;
}

export interface FileDataAPI extends BaseFileData {
  _id: string;
  uploadedByUserId: string;
  uploadedByUser?: UserAPI;
}

const fileSchema = new Schema<FileData>(
  {
    rawFilePath: { type: String, required: true, unique: true },
    filePath: { type: String },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(FileType),
      required: true,
    },
    size: { type: Number, required: true },
    service: {
      type: String,
      enum: Object.values(STORAGE_SERVICES),
      required: true,
    },
    description: { type: String, trim: true },
    uploadedByUserId: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
    lastAccessed: { type: Date, default: null },
    isPublic: { type: Boolean, default: false },
    folder: { type: String, trim: true },
  },
  { timestamps: true }
);

fileSchema.virtual("uploadedByUser", {
  ref: usersModelName,
  localField: "uploadedByUserId",
  foreignField: "_id",
  justOne: true,
});

fileSchema.set("toObject", { virtuals: true });
fileSchema.set("toJSON", { virtuals: true });

const FileModel =
  mongoose.models?.[fileModelName] ||
  mongoose.model<FileData>(fileModelName, fileSchema);

export default FileModel;
