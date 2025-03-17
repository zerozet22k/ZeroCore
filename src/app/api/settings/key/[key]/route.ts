import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { ValidSettingKey } from "@/config/CMS/settings/settingKeys";

const settingService = new SettingService();

async function handleGetSettingByKey(
  request: Request,
  params: { key: ValidSettingKey }
) {
  try {
    const setting = await settingService.getSettingByKey(params.key);

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { key: ValidSettingKey } }
) =>
  withAuthMiddleware(
    (req, user) => handleGetSettingByKey(req, context.params),
    true,
    [APP_PERMISSIONS.EDIT_SETTINGS]
  )(request);
