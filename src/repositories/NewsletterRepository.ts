// repositories/NewsletterRepository.ts
import dbConnect from "@/db";
import mongoose, { Types } from "mongoose";
import NewsletterModel, {
  INewsletter,
  INewsletterAttachmentBase,
} from "@/models/Newsletter";
import { FIREBASE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import { settingModelName } from "@/models";
import { FIREBASE_BASE_URL } from "@/models/constants";

class NewsletterRepository {
  private getUnifiedPipeline(matchStage: any): any[] {
    return [
      { $match: matchStage },
      {
        $lookup: {
          from: settingModelName,
          pipeline: [
            { $match: { key: FIREBASE_SETTINGS_KEYS.FIREBASE } },
            { $project: { _id: 0, bucket: "$value.bucket" } },
          ],
          as: "firebaseSettings",
        },
      },
      {
        $unwind: {
          path: "$firebaseSettings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          fileAttachments: {
            $map: {
              input: "$fileAttachments",
              as: "att",
              in: {
                $mergeObjects: [
                  "$$att",
                  {
                    publicUrl: {
                      $concat: [
                        FIREBASE_BASE_URL,
                        "$firebaseSettings.bucket",
                        "/o/",
                        "$$att.filePath",
                        "?alt=media",
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];
  }

  async findAll(
    searchQuery: string = "",
    page?: number,
    limit?: number
  ): Promise<{ newsletters: INewsletter[]; hasMore: boolean }> {
    await dbConnect();
    const filter: any = {};

    if (searchQuery.trim()) {
      filter.$expr = {
        $gt: [
          {
            $size: {
              $filter: {
                input: { $objectToArray: "$title" },
                as: "item",
                cond: {
                  $regexMatch: {
                    input: "$$item.v",
                    regex: searchQuery,
                    options: "i",
                  },
                },
              },
            },
          },
          0,
        ],
      };
    }

    const pipeline: any[] = this.getUnifiedPipeline(filter);
    pipeline.push({ $sort: { createdAt: -1 } });
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await NewsletterModel.aggregate(countPipeline).exec();
    const total = countResult[0] ? countResult[0].total : 0;

    if (page !== undefined && limit !== undefined) {
      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: limit });
    }

    const newsletters: INewsletter[] = await NewsletterModel.aggregate(
      pipeline
    ).exec();
    const hasMore = page && limit ? page * limit < total : false;
    return { newsletters, hasMore };
  }

  async findById(id: Types.ObjectId): Promise<INewsletter | null> {
    await dbConnect();
    const pipeline = this.getUnifiedPipeline({ _id: id });
    const result = await NewsletterModel.aggregate(pipeline).exec();
    return result[0] || null;
  }

  async create(data: Partial<INewsletter>): Promise<INewsletter> {
    await dbConnect();
    const newsletter = new NewsletterModel(data);
    return newsletter.save();
  }

  async update(
    id: Types.ObjectId,
    data: Partial<INewsletter>
  ): Promise<INewsletter | null> {
    await dbConnect();
    return NewsletterModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<INewsletter | null> {
    await dbConnect();
    return NewsletterModel.findByIdAndDelete(id).exec();
  }

  async updateAttachmentName(
    newsletterId: Types.ObjectId,
    attachmentId: Types.ObjectId,
    newName: string
  ): Promise<INewsletter | null> {
    await dbConnect();
    return NewsletterModel.findOneAndUpdate(
      { _id: newsletterId, "fileAttachments._id": attachmentId },
      { $set: { "fileAttachments.$.fileName": newName } },
      { new: true }
    ).exec();
  }

  async deleteAttachment(
    newsletterId: Types.ObjectId,
    attachmentId: Types.ObjectId
  ): Promise<INewsletter | null> {
    await dbConnect();
    return NewsletterModel.findByIdAndUpdate(
      newsletterId,
      { $pull: { fileAttachments: { _id: attachmentId } } },
      { new: true }
    ).exec();
  }

  async addAttachment(
    newsletterId: Types.ObjectId,
    attachment: Partial<INewsletterAttachmentBase>
  ): Promise<INewsletter | null> {
    await dbConnect();
    return NewsletterModel.findByIdAndUpdate(
      newsletterId,
      { $push: { fileAttachments: attachment } },
      { new: true }
    ).exec();
  }
}

export default NewsletterRepository;
