import { NextResponse } from "next/server";
import NewsletterService from "@/services/NewsletterService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const newsletterService = new NewsletterService();

async function handleAddAttachment(
  request: Request,
  { params }: { params: { newsletterId: string } }
) {
  try {
    const body = await request.json();
    const attachment = body.attachment;
    if (!attachment || !attachment.rawFilePath || !attachment.size) {
      return NextResponse.json(
        { error: "Missing required attachment fields." },
        { status: 400 }
      );
    }
    const updatedNewsletter = await newsletterService.addAttachment(
      params.newsletterId,
      attachment
    );
    return NextResponse.json(
      {
        message: "Attachment added successfully",
        newsletter: updatedNewsletter,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding attachment:", error);
    return NextResponse.json(
      { error: "Failed to add attachment." },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { newsletterId: string } }
) =>
  withAuthMiddleware((req, user) => handleAddAttachment(req, context), true, [
    APP_PERMISSIONS.UPLOAD_NEWSLETTER_ATTACHMENT,
  ])(request);
