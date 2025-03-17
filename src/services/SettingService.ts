import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { settingRepository } from "@/repositories/";

class SettingService {
  async getAllSettings(): Promise<SettingsInterface> {
    return await settingRepository.findAllStructured();
  }

  async getPublicSettings(

  ): Promise<Partial<SettingsInterface>> {
    return await settingRepository.findPublicSettings();
  }

  async getSettingByKey(
    key: keyof SettingsInterface,
    
  ): Promise<SettingsInterface[keyof SettingsInterface] | null> {
    return await settingRepository.findByKey(key, );
  }

  async getSettingsByKeys(
    keys: (keyof SettingsInterface)[],
    
  ): Promise<Partial<SettingsInterface>> {
    return await settingRepository.findByKeys(keys, );
  }

  async upsertSettings(
    updates: Partial<SettingsInterface>,
    
  ): Promise<SettingsInterface> {
    return await settingRepository.upsertSettingsStructured(
      updates,
      
    );
  }
}

export default SettingService;
