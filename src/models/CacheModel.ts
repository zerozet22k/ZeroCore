import mongoose from "mongoose";
import { cacheModelName } from ".";

const cacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export const CacheModel =
  mongoose.models?.[cacheModelName] ||
  mongoose.model<Cache>(cacheModelName, cacheSchema);
