import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import UserService from "@/services/UserService";

const fileService = new FileService();
const userService = new UserService();

async function getSignedUrl(
  request: Request,
  user: User,
  params: { id: string }
) {
  try {
    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");

    if (!typeParam || (typeParam !== "avatar" && typeParam !== "cover")) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing type parameter. Must be 'avatar' or 'cover'.",
        },
        { status: 400 }
      );
    }

    const { contentType } = await request.json();

    if (!["image/jpeg", "image/png"].includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid content type. Only JPEG and PNG are allowed." },
        { status: 400 }
      );
    }

    const uploadData =
      typeParam === "avatar"
        ? await fileService.generateProfileSignedUrl(contentType, params.id)
        : await fileService.generateCoverSignedUrl(contentType, params.id);

    return NextResponse.json(
      { ...uploadData, contentType },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`❌ Error generating signed URL:`, error);
    return NextResponse.json(
      { error: `Failed to generate signed URL.` },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => getSignedUrl(req, user, context.params),
    true,
    [APP_PERMISSIONS.UPLOAD_FILE, APP_PERMISSIONS.EDIT_USER]
  )(request);
