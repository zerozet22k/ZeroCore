import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { STORAGE_SERVICES } from "@/models/FileModel";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { detectFileType } from "@/utils/filesUtil";

const fileService = new FileService();

async function handleSaveMetadata(request: Request, user: User) {
  try {
    const body = await request.json();
    const file = body.file;

    if (!file || !file.rawFilePath || !file.size) {
      return NextResponse.json(
        {
          error:
            "Request must contain a valid 'file' object with 'rawFilePath', 'name', and 'size'.",
        },
        { status: 400 }
      );
    }

    const rawFilePath = file.rawFilePath;

    const result = await fileService.saveFileMetadata(
      {
        rawFilePath: rawFilePath,
        size: file.size,
        service: STORAGE_SERVICES.FIREBASE,
        isPublic: file.isPublic ?? true,
        description: file.description,
      },
      user._id
    );

    return NextResponse.json(
      {
        message: "File metadata saved successfully.",
        savedFile: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving metadata:", error);
    return NextResponse.json(
      { error: "Failed to save file metadata." },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware((req, user) => handleSaveMetadata(req, user), true, [
    APP_PERMISSIONS.UPLOAD_FILE,
  ])(request);
