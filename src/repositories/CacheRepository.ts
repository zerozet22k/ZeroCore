import { CacheModel } from "@/models/CacheModel";

class CacheRepository {
  private defaultTTL: number = 3600 * 1000;

  async set(
    key: string,
    value: any,
    ttl: number = this.defaultTTL
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttl);
    await CacheModel.findOneAndUpdate(
      { key },
      { value, expiresAt },
      { upsert: true, new: true }
    );
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheItem = await CacheModel.findOne({ key });
    if (!cacheItem) return null;

    if (cacheItem.expiresAt < new Date()) {
      await this.delete(key);
      return null;
    }

    return cacheItem.value as T;
  }

  async delete(key: string): Promise<void> {
    await CacheModel.deleteOne({ key });
  }

  async clear(): Promise<void> {
    await CacheModel.deleteMany({});
  }
}

export default CacheRepository;
