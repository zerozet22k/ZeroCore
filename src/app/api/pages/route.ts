import { NextResponse } from "next/server";
import PageService from "@/services/PageService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { PagesInterface } from "@/config/CMS/pages/pageKeys";
import { APP_PERMISSIONS } from "@/config/permissions";

const pageService = new PageService();

// ✅ Handle GET request for fetching all pages
async function handleGetAllPagesRequest(request: Request) {
  try {
    const pages = await pageService.getAllPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Handle PUT request for updating pages
async function handleUpsertPagesRequest(request: Request) {
  try {
    const { pages } = await request.json();

    if (typeof pages !== "object" || Array.isArray(pages) || pages === null) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const updatedPages = await pageService.upsertPages(
      pages as Partial<PagesInterface>
    );

    return NextResponse.json({
      message: "Pages updated successfully",
      updatedPages,
    });
  } catch (error) {
    console.error("Error updating pages in bulk:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Export GET and PUT routes with authentication middleware
export const GET = async (request: Request) =>
  withAuthMiddleware((req, userId) => handleGetAllPagesRequest(req), true, [
    APP_PERMISSIONS.ADMIN,
  ])(request);

export const PUT = async (request: Request) =>
  withAuthMiddleware((req) => handleUpsertPagesRequest(req), true, [
    APP_PERMISSIONS.EDIT_PAGES,
  ])(request);
