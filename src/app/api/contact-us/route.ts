import { NextResponse } from "next/server";
import MailService from "@/services/MailService";

const mailService = new MailService();

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const mailSubject = "New Contact Us Message";
    const mailText = `
      A new message has been received from the contact form:
      - Name: ${name}
      - Email: ${email}
      - Message: ${message}
    `;

    try {
      const response = await mailService.sendMail(mailSubject, mailText);
      return NextResponse.json(
        { message: "Your message has been sent successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending Contact Us email:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error handling Contact Us request:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
};
