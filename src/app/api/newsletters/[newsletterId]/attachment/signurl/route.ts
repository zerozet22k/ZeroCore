import { NextResponse } from "next/server";
import NewsletterService from "@/services/NewsletterService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const newsletterService = new NewsletterService();

async function handleGenerateSignedUrl(
  request: Request,
  { params }: { params: { newsletterId: string } },
  user: any
) {
  try {
    const { fileName, contentType } = await request.json();
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const result = await newsletterService.generateSignedUrlForAttachment(
      fileName,
      contentType
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL." },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { newsletterId: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleGenerateSignedUrl(req, context, user),
    true,
    [APP_PERMISSIONS.UPLOAD_NEWSLETTER_ATTACHMENT]
  )(request);
