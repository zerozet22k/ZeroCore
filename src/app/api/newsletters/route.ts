import { NextResponse } from "next/server";
import NewsletterService from "@/services/NewsletterService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const newsletterService = new NewsletterService();

export const GET = async (request: Request) => {
  try {
    const {
      search = "",
      page,
      limit,
    } = Object.fromEntries(new URL(request.url).searchParams);
    const pageNum = page ? parseInt(page as string) : undefined;
    const limitNum = limit ? parseInt(limit as string) : undefined;
    const { newsletters, hasMore } = await newsletterService.getAllNewsletters(
      search as string,
      pageNum,
      limitNum
    );
    return NextResponse.json({ newsletters, hasMore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) =>
  withAuthMiddleware(
    async (req, user) => {
      try {
        const data = await req.json();
        if (!data.title) {
          return NextResponse.json(
            { error: "Title is required." },
            { status: 400 }
          );
        }
        const newsletter = await newsletterService.createNewsletter(data);
        return NextResponse.json(
          { message: "Newsletter created successfully", newsletter },
          { status: 201 }
        );
      } catch (error) {
        console.error("Error creating newsletter:", error);
        return NextResponse.json(
          { error: "Failed to create newsletter." },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.CREATE_NEWSLETTER]
  )(request);
