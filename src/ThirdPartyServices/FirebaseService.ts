import admin from "firebase-admin";
import { getStorage, Storage } from "firebase-admin/storage";
import { Storage as GoogleCloudStorage } from "@google-cloud/storage";
import {
  FIREBASE_SETTINGS_KEYS,
  FIREBASE_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import SettingRepository from "@/repositories/SettingRepository";

class FirebaseService {
  private static instance: FirebaseService;
  private settingRepository: SettingRepository;
  private bucket: ReturnType<Storage["bucket"]> | null = null;
  private googleStorage: GoogleCloudStorage | null = null;
  private lastInitTime: number | null = null;
  private static INIT_THRESHOLD = 5 * 60 * 1000; 

  private constructor() {
    this.settingRepository = new SettingRepository();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async isFirebaseAvailable(): Promise<boolean> {
    try {
      const firebaseConfig = (await this.settingRepository.findByKey(
        FIREBASE_SETTINGS_KEYS.FIREBASE
      )) as FIREBASE_SETTINGS_TYPES[typeof FIREBASE_SETTINGS_KEYS.FIREBASE];

      return !!(firebaseConfig && firebaseConfig.bucket);
    } catch {
      return false;
    }
  }

  async initFirebase() {
    const currentTime = Date.now();
    if (
      this.bucket &&
      this.googleStorage &&
      this.lastInitTime &&
      currentTime - this.lastInitTime < FirebaseService.INIT_THRESHOLD
    ) {
      return;
    }

    const firebaseConfig = (await this.settingRepository.findByKey(
      FIREBASE_SETTINGS_KEYS.FIREBASE
    )) as FIREBASE_SETTINGS_TYPES[typeof FIREBASE_SETTINGS_KEYS.FIREBASE];

    if (!firebaseConfig) {
      throw new Error("Firebase settings not found.");
    }

    if (!admin.apps.length) {
      const formattedServiceAccount: admin.ServiceAccount = {
        projectId: firebaseConfig.serviceAccount.project_id,
        clientEmail: firebaseConfig.serviceAccount.client_email,
        privateKey: firebaseConfig.serviceAccount.private_key,
      };

      admin.initializeApp({
        credential: admin.credential.cert(formattedServiceAccount),
        storageBucket: firebaseConfig.bucket,
      });
    }

    this.bucket = getStorage().bucket();
    this.googleStorage = new GoogleCloudStorage();
    this.lastInitTime = currentTime;
  }

  getBucket(): ReturnType<Storage["bucket"]> {
    if (!this.bucket) {
      throw new Error("Firebase has not been initialized.");
    }
    return this.bucket;
  }

  async generateSignedUrl(
    filePath: string,
    contentType: string
  ): Promise<string> {
    if (!this.googleStorage) {
      await this.initFirebase();
    }

    if (!this.bucket) {
      throw new Error("Firebase bucket not initialized.");
    }

    const file = this.bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    return url;
  }
}

export default FirebaseService;
