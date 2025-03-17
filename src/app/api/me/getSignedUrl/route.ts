import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";

const fileService = new FileService();

async function getMySignedUrl(request: Request, user: User) {
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
        ? await fileService.generateProfileSignedUrl(
            contentType,
            user._id.toString()
          )
        : await fileService.generateCoverSignedUrl(
            contentType,
            user._id.toString()
          );
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

export const POST = async (request: Request) =>
  withAuthMiddleware((req, user) => getMySignedUrl(req, user), true)(request);
