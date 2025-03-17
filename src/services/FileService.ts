import fs from "fs";
import path from "path";
import { Types } from "mongoose";
import {
  STORAGE_SERVICES,
  FileData,
  StorageServiceType,
} from "@/models/FileModel";
import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import FileRepository from "@/repositories/FileRepository";
import { FIREBASE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import { toObjectId } from "@/repositories";
import { getFileFolderWithType } from "@/utils/filesUtil";

class FileService {
  private fileRepository: FileRepository;
  private firebaseService: FirebaseService;
  public folderPath: string;

  constructor() {
    this.fileRepository = new FileRepository();
    this.firebaseService = FirebaseService.getInstance();
    this.folderPath = "default";
  }

  async getAllFiles(
    searchQuery = "",
    fileType = "",
    uploadedByUserId?: string,
    page?: number,
    limit?: number,
    selected: string[] = []
  ): Promise<{ files: FileData[]; hasMore: boolean }> {
    const selectedObjectIds = selected.map(toObjectId);
    const userObjectId = uploadedByUserId
      ? toObjectId(uploadedByUserId)
      : undefined;

    return this.fileRepository.findAll(
      searchQuery,
      fileType,
      userObjectId,
      page,
      limit,
      selectedObjectIds
    );
  }

  async generateSignedUrl(fileName: string, contentType: string) {
    await this.firebaseService.initFirebase();

    const rawFilePath = `${this.folderPath}/${Date.now()}_${fileName}`;
    const signedUrl = await this.firebaseService.generateSignedUrl(
      rawFilePath,
      contentType
    );

    return { uploadUrl: signedUrl, filePath: rawFilePath };
  }

  async generateProfileSignedUrl(contentType: string, userId: string) {
    await this.firebaseService.initFirebase();

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const rawFilePath = `profile_images/${userId}/${timestamp}.jpg`;

    const signedUrl = await this.firebaseService.generateSignedUrl(
      rawFilePath,
      contentType
    );

    return { uploadUrl: signedUrl, filePath: rawFilePath };
  }

  async generateCoverSignedUrl(contentType: string, userId: string) {
    await this.firebaseService.initFirebase();

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const rawFilePath = `cover_images/${userId}/${timestamp}.jpg`;

    const signedUrl = await this.firebaseService.generateSignedUrl(
      rawFilePath,
      contentType
    );

    return { uploadUrl: signedUrl, filePath: rawFilePath };
  }

  async listLocalFiles(
    directory: string = path.join(process.cwd(), "public")
  ): Promise<Partial<FileData>[]> {
    let files: Partial<FileData>[] = [];

    if (!fs.existsSync(directory)) return files;

    const entries = fs.readdirSync(directory);

    for (const entry of entries) {
      const entryPath = path.join(directory, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isDirectory()) {
        files = files.concat(await this.listLocalFiles(entryPath));
      } else {
        if (entry.toLowerCase() === "site.webmanifest") continue;

        const relativePath = path.relative(
          path.join(process.cwd(), "public"),
          entryPath
        );

        const rawFilePath = `/${relativePath.replace(/\\/g, "/")}`;

        files.push({
          rawFilePath,
          service: STORAGE_SERVICES.LOCAL,
          size: stat.size,
          createdAt: stat.ctime,
          isPublic: true,
        });
      }
    }

    return files;
  }

  async listFirebaseFiles(): Promise<Partial<FileData>[]> {
    if (!(await this.firebaseService.isFirebaseAvailable())) {
      console.warn("⚠️ Firebase is not configured. Skipping Firebase files.");
      return [];
    }

    try {
      await this.firebaseService.initFirebase();
      const bucket = this.firebaseService.getBucket();

      const [files] = await bucket.getFiles({
        prefix: `${this.folderPath}/`,
      });

      return files.map((file) => {
        const rawFilePath = file.name;
        return {
          rawFilePath,
          service: STORAGE_SERVICES.FIREBASE,
          size: Number(file.metadata.size),
          createdAt: file.metadata.timeCreated
            ? new Date(file.metadata.timeCreated)
            : new Date(),
          isPublic: true,
        };
      });
    } catch (error) {
      console.error("❌ Error fetching Firebase files:", error);
      return [];
    }
  }

  async syncFiles(files: Partial<FileData>[], userId: Types.ObjectId) {
    let count = 0;

    for (const file of files) {
      try {
        await this.saveFileMetadata(file, userId);
        count++;
      } catch (error: any) {
        if (error.message === "File with the same path already exists.") {
          continue;
        } else {
          throw error;
        }
      }
    }
    return count;
  }

  async saveFileMetadata(fileData: Partial<FileData>, userId: Types.ObjectId) {
    const service: StorageServiceType =
      fileData.service === FIREBASE_SETTINGS_KEYS.FIREBASE
        ? STORAGE_SERVICES.FIREBASE
        : STORAGE_SERVICES.LOCAL;

    const { folder, fileName, fileType, urlFriendlyFilePath } =
      getFileFolderWithType(fileData.rawFilePath);

    const formattedFile: Partial<FileData> = {
      ...fileData,
      service,
      type: fileType,
      name: fileName,
      folder,
      filePath: urlFriendlyFilePath,
      uploadedByUserId: userId,
    };

    const existingFile = await this.fileRepository.findByPathAndService(
      formattedFile.rawFilePath!,
      formattedFile.service!
    );

    if (existingFile) {
      throw new Error("File with the same path already exists.");
    }

    return this.fileRepository.create(formattedFile);
  }

  async getFileById(fileId: string): Promise<FileData | null> {
    const fileObjectId = toObjectId(fileId);
    return this.fileRepository.findById(fileObjectId);
  }

  async getFileByRawPath(rawPath: string): Promise<FileData | null> {
    return this.fileRepository.findByRawPath(rawPath);
  }

  async deleteFile(fileId: string) {
    const fileObjectId = toObjectId(fileId);
    const file = await this.fileRepository.findById(fileObjectId);
    if (!file) throw new Error("File not found in database.");

    if (file.service === STORAGE_SERVICES.FIREBASE) {
      await this.firebaseService.initFirebase();
      const bucket = this.firebaseService.getBucket();

      const fileRef = bucket.file(file.rawFilePath);
      const [exists] = await fileRef.exists();
      if (exists) {
        await fileRef.delete();
      } else {
        console.log("File not found in Firebase Storage. Skipping deletion.");
      }
    }

    return this.fileRepository.deleteById(fileObjectId);
  }
}

export default FileService;
