import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { toObjectId } from "@/repositories";

const userService = new UserService();
const roleService = new RoleService();
const fileService = new FileService();

async function handlePublicRequest(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      searchQuery = "",
      fileType = "",
      uploadedByUserId = "",
      page,
      limit,
      selected = [],
    } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing required parameter: type" },
        { status: 400 }
      );
    }

    let items: any[] = [];
    let hasMore = false;

    switch (type) {
      case "users": {
        const { users, hasMore: moreUsers } = await userService.getAllUsers(
          searchQuery,
          page,
          limit,
          selected
        );
        items = users;
        hasMore = moreUsers;
        break;
      }
      case "roles": {
        const { roles, hasMore: moreRoles } = await roleService.getAllRoles(
          searchQuery,
          page,
          limit,
          selected
        );
        items = roles;
        hasMore = moreRoles;
        break;
      }
      case "files": {
        const { files, hasMore: moreFiles } = await fileService.getAllFiles(
          searchQuery ?? undefined,
          fileType ?? undefined,
          uploadedByUserId ?? undefined,
          page,
          limit,
          selected
        );
        items = files;
        hasMore = moreFiles;
        break;
      }
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ items, hasMore }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in handlePublicRequest:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware(
    async (req) => {
      return await handlePublicRequest(req);
    },
    true,
    [
      APP_PERMISSIONS.VIEW_USERS,
      APP_PERMISSIONS.VIEW_ROLES,
      APP_PERMISSIONS.VIEW_FILES,
    ]
  )(request);
