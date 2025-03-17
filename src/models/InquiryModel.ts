import mongoose, { Document, Schema, Types } from "mongoose";
import { usersModelName } from ".";
import { User, UserAPI } from "./UserModel";

const inquiryModelName: string = "Inquiry";

interface BaseReply {
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BaseInquiry {
  text: string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply extends BaseReply, Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  user?: User;
}

export interface ReplyAPI extends BaseReply {
  _id: string;
  user_id: string;
  user?: UserAPI;
}

export interface Inquiry extends BaseInquiry, Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  user?: User;
  replies: Reply[];
}

export interface InquiryAPI extends BaseInquiry {
  _id: string;
  user_id: string;
  user?: UserAPI;
  replies: ReplyAPI[];
}

const ReplySchema = new Schema<Reply>(
  {
    text: { type: String, required: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
  },
  { timestamps: true, _id: true }
);

ReplySchema.virtual("user", {
  ref: usersModelName,
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

ReplySchema.set("toObject", { virtuals: true });
ReplySchema.set("toJSON", { virtuals: true });

const InquirySchema = new Schema<Inquiry>(
  {
    text: { type: String, required: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
    isClosed: { type: Boolean, default: false },
    replies: [ReplySchema],
  },
  { timestamps: true }
);

InquirySchema.virtual("user", {
  ref: usersModelName,
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

InquirySchema.set("toObject", { virtuals: true });
InquirySchema.set("toJSON", { virtuals: true });

const InquiryModel =
  mongoose.models?.[inquiryModelName] ||
  mongoose.model<Inquiry>(inquiryModelName, InquirySchema);

export default InquiryModel;
