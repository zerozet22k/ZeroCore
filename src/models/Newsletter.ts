import mongoose, { Document, Schema, Types } from "mongoose";
import { LanguageJson } from "@/utils/getTranslatedText";
import { newsletterModelName } from ".";

export interface INewsletterAttachmentBase {
  fileName: string;
  rawFilePath: string;
  filePath: string;
  publicUrl: string;
  size: number;
  description?: string;
  createdAt: Date;
}
export interface INewsletterAttachment
  extends INewsletterAttachmentBase,
    Document {
  _id: Types.ObjectId;
}

export interface INewsletterAttachmentAPI extends INewsletterAttachmentBase {
  _id: string;
}

export interface INewsletterBase {
  title: LanguageJson;
  fileAttachments: INewsletterAttachmentBase[];
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface INewsletter extends INewsletterBase, Document {
  _id: Types.ObjectId;
  fileAttachments: INewsletterAttachment[];
}

export interface INewsletterAPI extends INewsletterBase {
  _id: string;
  fileAttachments: INewsletterAttachmentAPI[];
}

const NewsletterAttachmentSchema = new Schema<INewsletterAttachmentBase>(
  {
    rawFilePath: { type: String, required: true },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    publicUrl: { type: String, required: true },
    size: { type: Number, required: true },
    description: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const newsletterSchema = new Schema<INewsletter>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    fileAttachments: [NewsletterAttachmentSchema],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

newsletterSchema.set("toJSON", { virtuals: true });
newsletterSchema.set("toObject", { virtuals: true });


const NewsletterModel =
  mongoose.models?.[newsletterModelName] ||
  mongoose.model<INewsletter>(newsletterModelName, newsletterSchema);

export default NewsletterModel;
