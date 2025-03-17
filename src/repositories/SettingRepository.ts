import dbConnect from "@/db";
import SettingModel from "../models/SettingModel";
import { Model } from "mongoose";
import {
  SETTINGS_GUIDE,
  SettingsInterface,
} from "@/config/CMS/settings/settingKeys";

class SettingRepository {
  private settingModel: Model<any>;

  constructor() {
    this.settingModel = SettingModel;
  }

  async findAllStructured(): Promise<SettingsInterface> {
    await dbConnect();

    const pipeline = [
      { $project: { _id: 0, key: 1, value: 1, isPublic: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return (results[0] || {}) as SettingsInterface;
  }
  async findByKey<K extends keyof SettingsInterface>(
    key: K
  ): Promise<SettingsInterface[K] | null> {
    await dbConnect();

    const pipeline = [{ $match: { key } }, { $project: { _id: 0, value: 1 } }];

    const result = await this.settingModel.aggregate(pipeline).exec();
    return result.length > 0 ? (result[0].value as SettingsInterface[K]) : null;
  }

  async findByKeys<K extends keyof SettingsInterface>(
    keys: K[]
  ): Promise<Pick<SettingsInterface, K>> {
    await dbConnect();

    const pipeline = [
      { $match: { key: { $in: keys } } },
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return (results[0] || {}) as Pick<SettingsInterface, K>;
  }

  async findPublicSettings(): Promise<Partial<SettingsInterface>> {
    await dbConnect();

    const pipeline = [
      { $match: { isPublic: true } },
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return results[0] || {};
  }

  async upsertSettingsStructured(
    updates: Partial<SettingsInterface>
  ): Promise<SettingsInterface> {
    await dbConnect();

    const bulkOperations = Object.entries(updates).map(([key, value]) => {
      const isPublic =
        SETTINGS_GUIDE[key as keyof typeof SETTINGS_GUIDE]?.visibility ===
        "public";

      return {
        updateOne: {
          filter: { key },
          update: { $set: { value, isPublic } },
          upsert: true,
        },
      };
    });

    await this.settingModel.bulkWrite(bulkOperations);

    return this.findAllStructured();
  }
}

export default SettingRepository;
