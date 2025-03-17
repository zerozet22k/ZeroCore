import dbConnect from "@/db";
import PageModel from "../models/PageModel";
import { Model } from "mongoose";
import { PagesInterface } from "@/config/CMS/pages/pageKeys";

class PageRepository {
  private pageModel: Model<any>;

  constructor() {
    this.pageModel = PageModel;
  }

  async findAllStructured(): Promise<PagesInterface> {
    await dbConnect();

    const pipeline = [
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredPages: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredPages",
          },
        },
      },
    ];

    const results = await this.pageModel.aggregate(pipeline).exec();
    return (results[0] || {}) as PagesInterface;
  }

  async findByKey<K extends keyof PagesInterface>(
    key: K
  ): Promise<PagesInterface[K] | null> {
    await dbConnect();

    const pipeline = [{ $match: { key } }, { $project: { _id: 0, value: 1 } }];

    const result = await this.pageModel.aggregate(pipeline).exec();
    return result.length > 0 ? (result[0].value as PagesInterface[K]) : null;
  }

  async findByKeys<K extends keyof PagesInterface>(
    keys: K[]
  ): Promise<Pick<PagesInterface, K>> {
    await dbConnect();

    const pipeline = [
      { $match: { key: { $in: keys } } },
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredPages: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredPages",
          },
        },
      },
    ];

    const results = await this.pageModel.aggregate(pipeline).exec();
    return (results[0] || {}) as Pick<PagesInterface, K>;
  }

  async upsertPagesStructured(
    updates: Partial<PagesInterface>
  ): Promise<PagesInterface> {
    await dbConnect();

    const bulkOperations = Object.entries(updates).map(([key, value]) => {
      return {
        updateOne: {
          filter: { key },
          update: { $set: { value } },
          upsert: true,
        },
      };
    });

    await this.pageModel.bulkWrite(bulkOperations);

    return this.findAllStructured();
  }
}

export default PageRepository;
