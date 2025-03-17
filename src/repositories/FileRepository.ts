import dbConnect from "@/db";
import FileModel, { FileData, STORAGE_SERVICES } from "@/models/FileModel";
import { Types } from "mongoose";
import { FIREBASE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import { settingModelName } from "@/models";
import { FIREBASE_BASE_URL } from "@/models/constants";

class FileRepository {
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
          publicUrl: {
            $cond: {
              if: { $eq: ["$service", STORAGE_SERVICES.FIREBASE] },
              then: {
                $concat: [
                  FIREBASE_BASE_URL,
                  "$firebaseSettings.bucket",
                  "/o/",
                  "$filePath",
                  "?alt=media",
                ],
              },
              else: "$rawFilePath",
            },
          },
        },
      },
    ];
  }

  async findAll(
    searchQuery: string = "",
    fileType: string = "",
    uploadedByUserId?: Types.ObjectId,
    page?: number,
    limit?: number,
    selected: Types.ObjectId[] = []
  ): Promise<{ files: FileData[]; hasMore: boolean }> {
    await dbConnect();

    const match: any = {};

    if (selected.length) {
      match._id = { $in: selected };
    }

    const trimmedSearchQuery = searchQuery.trim();
    if (trimmedSearchQuery) {
      match.$or = [
        { name: { $regex: trimmedSearchQuery, $options: "i" } },
        { description: { $regex: trimmedSearchQuery, $options: "i" } },
      ];
    }

    if (fileType && fileType.trim() !== "") {
      match.type = fileType;
    }

    if (uploadedByUserId) {
      match.uploadedByUserId = uploadedByUserId;
    }

    if (match.filePath) {
      match.rawFilePath = match.filePath;
      delete match.filePath;
    }

    const pipeline: any[] = this.getUnifiedPipeline(match);
    pipeline.push({ $sort: { createdAt: -1 } });

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await FileModel.aggregate(countPipeline).exec();
    const totalFiles = countResult[0] ? countResult[0].total : 0;

    if (page !== undefined && limit !== undefined) {
      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: limit });
    }

    const files: FileData[] = await FileModel.aggregate(pipeline).exec();
    return {
      files,
      hasMore:
        page !== undefined && limit !== undefined
          ? page * limit < totalFiles
          : false,
    };
  }

  async findById(id: Types.ObjectId): Promise<FileData | null> {
    await dbConnect();
    const pipeline = this.getUnifiedPipeline({ _id: id });
    const result = await FileModel.aggregate(pipeline).exec();
    return result[0] || null;
  }

  async findByRawPath(rawPath: string): Promise<FileData | null> {
    await dbConnect();
    const pipeline = this.getUnifiedPipeline({ rawFilePath: rawPath });
    const result = await FileModel.aggregate(pipeline).exec();
    return result[0] || null;
  }

  async findByPathAndService(
    rawPath: string,
    service: string
  ): Promise<FileData | null> {
    await dbConnect();
    const pipeline = this.getUnifiedPipeline({ rawFilePath: rawPath, service });
    const result = await FileModel.aggregate(pipeline).exec();
    return result[0] || null;
  }

  async create(fileData: Partial<FileData>): Promise<FileData> {
    await dbConnect();

    if (!fileData.uploadedByUserId) {
      throw new Error("Missing uploadedByUserId.");
    }

    const newFile = new FileModel(fileData);
    const savedFile = await newFile.save();

    if (savedFile.service === STORAGE_SERVICES.FIREBASE) {
      const pipeline = this.getUnifiedPipeline({ _id: savedFile._id });
      const result = await FileModel.aggregate(pipeline).exec();
      return result[0] || savedFile;
    }

    return savedFile;
  }

  async deleteById(id: Types.ObjectId): Promise<FileData | null> {
    await dbConnect();
    const file = await FileModel.findById(id).exec();
    if (!file) return null;
    return FileModel.findByIdAndDelete(id).exec();
  }
}

export default FileRepository;
