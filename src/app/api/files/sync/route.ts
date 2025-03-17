import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";
import { FileData } from "@/models/FileModel";

const fileService = new FileService();

async function handleSyncFilesRequest(req: Request, user: User) {
  try {
    if (!user._id) {
      return NextResponse.json(
        { error: "User ID is missing in authentication." },
        { status: 400 }
      );
    }

    const service = new URL(req.url).searchParams.get("service") ?? "all";

    let localFiles: Partial<FileData>[] = [];
    let firebaseFiles: Partial<FileData>[] = [];

    if (service === "local" || service === "all") {
      localFiles = await fileService.listLocalFiles();
    }

    if (service === "firebase" || service === "all") {
      firebaseFiles = await fileService.listFirebaseFiles();
    }
    const allFiles = [...localFiles, ...firebaseFiles].map((file) => ({
      ...file,
      uploadedByUserId: user._id,
      isPublic: true,
    }));

    const uploadedCount = await fileService.syncFiles(allFiles, user._id);

    return NextResponse.json(
      { message: `${uploadedCount} new files synced from ${service}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing files:", error);
    return NextResponse.json(
      { error: "Failed to sync files" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware((req, user) => handleSyncFilesRequest(req, user), true, [
    APP_PERMISSIONS.SYNC_FILES,
  ])(request);
