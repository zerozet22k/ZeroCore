import { User } from "@/models/UserModel";
import MailService from "@/services/MailService";

const mailService = new MailService();

export async function sendPaymentEmail(
  user: User,
  amount: number,
  screenshot: Buffer
): Promise<boolean> {
  try {
    const mailSubject = "New Offline Top-up Request";
    const mailText = `
      User requested a top-up:
      - Name: ${user.name}
      - Username: ${user.username}
      - Email: ${user.email}
      - User ID: ${user._id}
    `;

    const attachments = [{ filename: "screenshot.png", content: screenshot }];

    await mailService.sendMail(mailSubject, mailText, attachments);
    console.log(`Email sent successfully for user ${user._id}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email for user ${user._id}:`, error);
    return false;
  }
}
