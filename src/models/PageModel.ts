import mongoose, { Document, Schema, Types } from "mongoose";

const pageModelName: string = "Pages";

interface BasePage {
  key: string;
  value: any;
}

export interface Page extends BasePage, Document {
  _id: Types.ObjectId;
}

export interface PageAPI extends BasePage {
  _id: string;
}

const PageSchema = new Schema<Page>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const PageModel =
  mongoose.models?.[pageModelName] || mongoose.model(pageModelName, PageSchema);

export default PageModel;
