import { Inquiry, Reply } from "@/models/InquiryModel";
import { inquiryRepository, toObjectId } from "@/repositories";

class InquiryService {
  async getAllInquiries(
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ inquiries: Inquiry[]; total: number }> {
    return inquiryRepository.findAll(searchQuery, page, limit);
  }

  async getInquiriesByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ inquiries: Inquiry[]; total: number }> {
    const userObjectId = toObjectId(userId);
    return inquiryRepository.findByUserId(userObjectId, page, limit);
  }

  async getInquiryById(inquiryId: string): Promise<Inquiry | null> {
    return inquiryRepository.findById(toObjectId(inquiryId));
  }

  async createInquiry(inquiryData: Partial<Inquiry>): Promise<Inquiry> {
    return inquiryRepository.create(inquiryData);
  }

  async updateInquiry(
    inquiryId: string,
    updateData: Partial<Inquiry>
  ): Promise<Inquiry | null> {
    return inquiryRepository.update(toObjectId(inquiryId), updateData);
  }

  async deleteInquiry(inquiryId: string): Promise<Inquiry | null> {
    return inquiryRepository.delete(toObjectId(inquiryId));
  }

  async addReply(
    inquiryId: string,
    replyData: Partial<Reply>
  ): Promise<Inquiry | null> {
    return inquiryRepository.addReply(toObjectId(inquiryId), replyData);
  }

  async deleteReply(
    inquiryId: string,
    replyId: string
  ): Promise<Inquiry | null> {
    return inquiryRepository.deleteReply(
      toObjectId(inquiryId),
      toObjectId(replyId)
    );
  }

  async closeInquiry(inquiryId: string): Promise<Inquiry | null> {
    return inquiryRepository.closeInquiry(toObjectId(inquiryId));
  }
}

export default InquiryService;
