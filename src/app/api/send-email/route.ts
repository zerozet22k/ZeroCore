import { NextResponse } from "next/server";
import MailService from "@/services/MailService";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Email, subject, and message are required." },
        { status: 400 }
      );
    }

    const mailService = new MailService();

    const fullMessage = `Sender Email: ${email}\n\n${message}`;

    await mailService.sendMail(subject, fullMessage);

    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
};
