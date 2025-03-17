import dbConnect from "@/db";
import InquiryModel, { Inquiry, Reply } from "@/models/InquiryModel";
import { Model, Types } from "mongoose";

class InquiryRepository {
  private inquiryModel: Model<Inquiry>;

  constructor() {
    this.inquiryModel = InquiryModel;
  }
  async findAll(
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ inquiries: Inquiry[]; total: number }> {
    await dbConnect();

    const query: any = {};
    if (searchQuery) query.text = { $regex: searchQuery, $options: "i" };

    const inquiries = await this.inquiryModel
      .find(query)
      .populate("user")
      .populate("replies.user")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.inquiryModel.countDocuments(query);

    return { inquiries, total };
  }

  async findByUserId(
    userId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<{ inquiries: Inquiry[]; total: number }> {
    await dbConnect();

    const query = { user_id: userId };

    const inquiries = await this.inquiryModel
      .find(query)
      .populate("user")
      .populate("replies.user")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.inquiryModel.countDocuments(query);

    return { inquiries, total };
  }

  async findById(inquiryId: Types.ObjectId): Promise<Inquiry | null> {
    await dbConnect();
    return this.inquiryModel
      .findById(inquiryId)
      .populate("user")
      .populate("replies.user")
      .exec();
  }

  async create(inquiryData: Partial<Inquiry>): Promise<Inquiry> {
    await dbConnect();
    const inquiry = new this.inquiryModel(inquiryData);
    return inquiry.save();
  }

  async update(
    inquiryId: Types.ObjectId,
    updateData: Partial<Inquiry>
  ): Promise<Inquiry | null> {
    await dbConnect();
    return this.inquiryModel
      .findByIdAndUpdate(inquiryId, updateData, { new: true })
      .populate("user")
      .populate("replies.user")
      .exec();
  }

  async delete(inquiryId: Types.ObjectId): Promise<Inquiry | null> {
    await dbConnect();
    return this.inquiryModel.findByIdAndDelete(inquiryId).exec();
  }

  async addReply(
    inquiryId: Types.ObjectId,
    replyData: Partial<Reply>
  ): Promise<Inquiry | null> {
    await dbConnect();

    const newReply = {
      _id: new Types.ObjectId(),
      text: replyData.text || "",
      user_id: replyData.user_id!,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return this.inquiryModel
      .findByIdAndUpdate(
        inquiryId,
        { $push: { replies: newReply } },
        { new: true, runValidators: true }
      )
      .populate("user")
      .populate("replies.user")
      .exec();
  }

  async deleteReply(
    inquiryId: Types.ObjectId,
    replyId: Types.ObjectId
  ): Promise<Inquiry | null> {
    await dbConnect();
    return this.inquiryModel
      .findByIdAndUpdate(
        inquiryId,
        { $pull: { replies: { _id: replyId } } },
        { new: true }
      )
      .populate("user")
      .populate("replies.user")
      .exec();
  }

  async closeInquiry(inquiryId: Types.ObjectId): Promise<Inquiry | null> {
    await dbConnect();
    return this.inquiryModel
      .findByIdAndUpdate(inquiryId, { isClosed: true }, { new: true })
      .exec();
  }
}

export default InquiryRepository;
