import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const fileService = new FileService();

async function generateSignedUrl(request: Request, user: any) {
  try {
    const { fileName, contentType } = await request.json();
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const { uploadUrl, filePath } = await fileService.generateSignedUrl(
      fileName,
      contentType
    );

    return NextResponse.json({ uploadUrl, filePath }, { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL." },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware((req, user) => generateSignedUrl(req, user), true, [
    APP_PERMISSIONS.UPLOAD_FILE,
  ])(request);
