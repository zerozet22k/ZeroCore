import { PagesInterface } from "@/config/CMS/pages/pageKeys";
import PageRepository from "@/repositories/PageRepository";

const pageRepository = new PageRepository();

class PageService {
  async getAllPages(): Promise<PagesInterface> {
    return await pageRepository.findAllStructured();
  }

  async getPageByKey<K extends keyof PagesInterface>(
    key: K
  ): Promise<PagesInterface[K] | null> {
    return await pageRepository.findByKey(key);
  }

  async getPagesByKeys<K extends keyof PagesInterface>(
    keys: K[]
  ): Promise<Pick<PagesInterface, K>> {
    return await pageRepository.findByKeys(keys);
  }

  async upsertPages(
    updates: Partial<PagesInterface>
  ): Promise<PagesInterface> {
    return await pageRepository.upsertPagesStructured(updates);
  }
}

export default PageService;
