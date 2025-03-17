import { NextResponse } from "next/server";
import NewsletterService from "@/services/NewsletterService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const newsletterService = new NewsletterService();

export const PUT = async (
  request: Request,
  { params }: { params: { newsletterId: string; attachmentId: string } }
) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const { newName } = await req.json();
        if (!newName) {
          return NextResponse.json(
            { error: "New name is required." },
            { status: 400 }
          );
        }
        const updatedNewsletter = await newsletterService.updateAttachmentName(
          params.newsletterId,
          params.attachmentId,
          newName
        );
        if (!updatedNewsletter) {
          return NextResponse.json(
            { error: "Newsletter or attachment not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(
          {
            message: "Attachment name updated successfully",
            newsletter: updatedNewsletter,
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error updating attachment name:", error);
        return NextResponse.json(
          { error: "Failed to update attachment name." },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.EDIT_NEWSLETTER_ATTACHMENT]
  )(request);

export const DELETE = async (
  request: Request,
  { params }: { params: { newsletterId: string; attachmentId: string } }
) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const updatedNewsletter = await newsletterService.deleteAttachment(
          params.newsletterId,
          params.attachmentId
        );
        if (!updatedNewsletter) {
          return NextResponse.json(
            { error: "Newsletter or attachment not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(
          {
            message: "Attachment deleted successfully",
            newsletter: updatedNewsletter,
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error deleting attachment:", error);
        return NextResponse.json(
          { error: "Failed to delete attachment." },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.DELETE_NEWSLETTER_ATTACHMENT]
  )(request);
