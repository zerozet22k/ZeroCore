import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";

const settingService = new SettingService();

async function handleGetAllPublicSettingsRequest(request: Request) {
  try {
    const settings = await settingService.getPublicSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) => {
  return handleGetAllPublicSettingsRequest(request);
};
