import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const fileService = new FileService();

async function handleGetFileRequest(request: Request, fileId: string) {
  try {
    const file = await fileService.getFileById(fileId);
    if (!file)
      return NextResponse.json({ error: "File not found." }, { status: 404 });

    return NextResponse.json(file, { status: 200 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteFileRequest(fileId: string) {
  try {
    await fileService.deleteFile(fileId);
    return NextResponse.json(
      { message: "File deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) =>
  withAuthMiddleware((req) => handleGetFileRequest(req, params.id), true, [
    APP_PERMISSIONS.VIEW_FILES,
  ])(request);

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) =>
  withAuthMiddleware(async () => handleDeleteFileRequest(params.id), true, [
    APP_PERMISSIONS.DELETE_FILE,
  ])(request);
