import { NextResponse } from "next/server";
import NewsletterService from "@/services/NewsletterService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const newsletterService = new NewsletterService();

export const GET = async (
  request: Request,
  { params }: { params: { newsletterId: string } }
) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const newsletter = await newsletterService.getNewsletterById(
          params.newsletterId
        );
        if (!newsletter) {
          return NextResponse.json(
            { error: "Newsletter not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(newsletter, { status: 200 });
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    false,
    []
  )(request);

export const PUT = async (
  request: Request,
  { params }: { params: { newsletterId: string } }
) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const data = await req.json();
        const updatedNewsletter = await newsletterService.updateNewsletter(
          params.newsletterId,
          data
        );
        if (!updatedNewsletter) {
          return NextResponse.json(
            { error: "Newsletter not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          {
            message: "Newsletter updated successfully",
            newsletter: updatedNewsletter,
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error updating newsletter:", error);
        return NextResponse.json(
          { error: "Failed to update newsletter" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.EDIT_NEWSLETTER]
  )(request);

export const DELETE = async (
  request: Request,
  { params }: { params: { newsletterId: string } }
) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const deletedNewsletter = await newsletterService.deleteNewsletter(
          params.newsletterId
        );
        if (!deletedNewsletter) {
          return NextResponse.json(
            { error: "Newsletter not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { message: "Newsletter deleted successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error deleting newsletter:", error);
        return NextResponse.json(
          { error: "Failed to delete newsletter" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.DELETE_NEWSLETTER]
  )(request);
