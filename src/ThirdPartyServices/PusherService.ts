import Pusher from "pusher";
import SettingRepository from "@/repositories/SettingRepository";
import {
  PUSHER_SETTINGS_KEYS,
  PUSHER_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/PUSHER_SETTINGS_KEYS";

class PusherService {
  private static instance: PusherService;
  private settingRepository: SettingRepository;
  private pusher: Pusher | null = null;
  private lastInitTime: number | null = null;
  private static INIT_THRESHOLD = 5 * 60 * 1000;

  private constructor() {
    this.settingRepository = new SettingRepository();
  }

  public static getInstance(): PusherService {
    if (!PusherService.instance) {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  public async isPusherAvailable(): Promise<boolean> {
    try {
      const pusherConfig = (await this.settingRepository.findByKey(
        PUSHER_SETTINGS_KEYS.PUSHER
      )) as PUSHER_SETTINGS_TYPES[typeof PUSHER_SETTINGS_KEYS.PUSHER];
      return !!(
        pusherConfig &&
        pusherConfig.app_id &&
        pusherConfig.key &&
        pusherConfig.secret &&
        pusherConfig.cluster
      );
    } catch (error) {
      return false;
    }
  }

  public async initPusher(): Promise<void> {
    const currentTime = Date.now();
    if (
      this.pusher &&
      this.lastInitTime &&
      currentTime - this.lastInitTime < PusherService.INIT_THRESHOLD
    ) {
      return;
    }

    const pusherConfig = (await this.settingRepository.findByKey(
      PUSHER_SETTINGS_KEYS.PUSHER
    )) as PUSHER_SETTINGS_TYPES[typeof PUSHER_SETTINGS_KEYS.PUSHER];

    if (!pusherConfig) {
      throw new Error("Pusher settings not found.");
    }

    this.pusher = new Pusher({
      appId: pusherConfig.app_id,
      key: pusherConfig.key,
      secret: pusherConfig.secret,
      cluster: pusherConfig.cluster,
      useTLS: true,
    });

    this.lastInitTime = currentTime;
  }

  public getPusher(): Pusher {
    if (!this.pusher) {
      throw new Error("Pusher has not been initialized.");
    }
    return this.pusher;
  }

  public async trigger(
    channel: string,
    event: string,
    data: any
  ): Promise<void> {
    if (!this.pusher) {
      await this.initPusher();
    }
    this.pusher!.trigger(channel, event, data);
  }
}

export default PusherService;
