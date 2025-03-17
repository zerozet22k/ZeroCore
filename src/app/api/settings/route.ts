import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { APP_PERMISSIONS } from "@/config/permissions";

const settingService = new SettingService();

async function handleGetAllSettingsRequest(request: Request) {
  try {
    const settings = await settingService.getAllSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpsertSettingsRequest(request: Request) {
  try {
    const { settings } = await request.json();

    if (
      typeof settings !== "object" ||
      Array.isArray(settings) ||
      settings === null
    ) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const updatedSettings = await settingService.upsertSettings(
      settings as Partial<SettingsInterface>
    );

    return NextResponse.json({
      message: "Settings updated successfully",
      updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings in bulk:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, userId) => handleGetAllSettingsRequest(req), true, [
    APP_PERMISSIONS.ADMIN,
  ])(request);

export const PUT = async (request: Request) =>
  withAuthMiddleware((req) => handleUpsertSettingsRequest(req), true, [
    APP_PERMISSIONS.EDIT_SETTINGS,
  ])(request);
