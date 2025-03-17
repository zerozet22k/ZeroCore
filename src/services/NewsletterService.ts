import NewsletterRepository from "@/repositories/NewsletterRepository";
import { INewsletter, INewsletterAttachmentBase } from "@/models/Newsletter";
import FirebaseService from "@/ThirdPartyServices/FirebaseService";
import { toObjectId } from "@/repositories";
import { getFileFolderWithType } from "@/utils/filesUtil";

class NewsletterService {
  private newsletterRepo: NewsletterRepository;
  private firebaseService: FirebaseService;
  private folderPath: string;

  constructor() {
    this.newsletterRepo = new NewsletterRepository();
    this.firebaseService = FirebaseService.getInstance();
    this.folderPath = "newsletter";
  }

  async createNewsletter(data: Partial<INewsletter>): Promise<INewsletter> {
    return this.newsletterRepo.create(data);
  }

  async getNewsletterById(id: string): Promise<INewsletter | null> {
    return this.newsletterRepo.findById(toObjectId(id));
  }

  async getAllNewsletters(
    searchQuery: string = "",
    page?: number,
    limit?: number
  ): Promise<{ newsletters: INewsletter[]; hasMore: boolean }> {
    return this.newsletterRepo.findAll(searchQuery, page, limit);
  }

  async updateNewsletter(
    id: string,
    data: Partial<INewsletter>
  ): Promise<INewsletter | null> {
    return this.newsletterRepo.update(toObjectId(id), data);
  }

  async deleteNewsletter(id: string): Promise<INewsletter | null> {
    const objId = toObjectId(id);
    const newsletter = await this.newsletterRepo.findById(objId);
    if (!newsletter) {
      throw new Error("Newsletter not found");
    }
    await this.firebaseService.initFirebase();
    const bucket = this.firebaseService.getBucket();

    for (const attachment of newsletter.fileAttachments) {
      const fileRef = bucket.file(attachment.filePath);
      const [exists] = await fileRef.exists();
      if (exists) {
        await fileRef.delete();
      }
    }
    return this.newsletterRepo.delete(objId);
  }

  async updateAttachmentName(
    newsletterId: string,
    attachmentId: string,
    newName: string
  ): Promise<INewsletter | null> {
    return this.newsletterRepo.updateAttachmentName(
      toObjectId(newsletterId),
      toObjectId(attachmentId),
      newName
    );
  }

  async deleteAttachment(
    newsletterId: string,
    attachmentId: string
  ): Promise<INewsletter | null> {
    const newsletter = await this.newsletterRepo.findById(
      toObjectId(newsletterId)
    );
    if (!newsletter) {
      throw new Error("Newsletter not found");
    }
    const attachment = newsletter.fileAttachments.find(
      (att) => att._id.toString() === attachmentId
    );
    if (!attachment) {
      throw new Error("Attachment not found");
    }
    await this.firebaseService.initFirebase();
    const bucket = this.firebaseService.getBucket();
    const fileRef = bucket.file(attachment.filePath);
    const [exists] = await fileRef.exists();
    if (exists) {
      await fileRef.delete();
    }
    return this.newsletterRepo.deleteAttachment(
      toObjectId(newsletterId),
      toObjectId(attachmentId)
    );
  }

  async addAttachment(
    newsletterId: string,
    attachment: Partial<INewsletterAttachmentBase>
  ): Promise<INewsletter | null> {
    const { folder, fileName, fileType, urlFriendlyFilePath } =
      getFileFolderWithType(attachment.rawFilePath);

    const formattedAttachment: Partial<INewsletterAttachmentBase> = {
      ...attachment,
      fileName: fileName,
      filePath: urlFriendlyFilePath,
      rawFilePath: attachment.rawFilePath,
    };
    return this.newsletterRepo.addAttachment(
      toObjectId(newsletterId),
      formattedAttachment
    );
  }
  async generateSignedUrlForAttachment(
    fileName: string,
    contentType: string
  ): Promise<{ uploadUrl: string; filePath: string }> {
    await this.firebaseService.initFirebase();
    const rawFilePath = `${this.folderPath}/${Date.now()}_${fileName}`;
    const signedUrl = await this.firebaseService.generateSignedUrl(
      rawFilePath,
      contentType
    );
    return { uploadUrl: signedUrl, filePath: rawFilePath };
  }
}

export default NewsletterService;
