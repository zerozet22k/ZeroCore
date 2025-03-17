import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/CMS/settings/settingKeys";
import userRepository from "@/repositories/UserRepository"; // Ensure correct import

const userService = new UserService();
const settingService = new SettingService();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.user?.email || !data.user?.password || !data.user?.username) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const siteSettings = data.settings?.[SETTINGS_KEYS.SITE_SETTINGS];
    if (!siteSettings?.siteName || !siteSettings?.siteUrl) {
      return NextResponse.json(
        { error: "Site name and URL are required in site settings" },
        { status: 400 }
      );
    }

    // Ensure only one system user exists
    await userService.setupDefaultRolesAndSystemUser(data.user);

    // Save settings
    const settingsUpdates = {
      [SETTINGS_KEYS.SITE_SETTINGS]: siteSettings,
    };
    await settingService.upsertSettings(settingsUpdates);

    return NextResponse.json(
      { message: "Setup completed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during setup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
