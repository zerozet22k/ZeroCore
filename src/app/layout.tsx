export const dynamic = "force-dynamic"; // Force dynamic rendering

import React from "react";
import { Metadata } from "next";
import SettingService from "@/services/SettingService";
import UserService from "@/services/UserService";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import { SEO_SETTINGS_KEYS } from "@/config/CMS/settings/keys/SEO_SETTINGS_KEYS";
import LayoutContent from "./layout-content";

async function getSettings(): Promise<Partial<SettingsInterface>> {
  try {
    const settingService = new SettingService();
    const userService = new UserService();

    const fetchedSettings = await settingService.getPublicSettings();
    await userService.syncRolePermissions(true);

    return fetchedSettings || {};
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const settings: Partial<SettingsInterface> = await getSettings();

  const siteName =
    settings[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]?.siteName?.trim() ||
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
    "Default Site Name";

  const description =
    settings[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.metaDescription?.trim() ||
    "Default description for SEO.";

  const keywords = settings[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.keywords
    ?.trim()
    .split(",") || ["default", "keywords"];

  const ogImage =
    settings[SEO_SETTINGS_KEYS.SEO_SETTINGS]?.ogImage?.trim() ||
    process.env.NEXT_PUBLIC_OG_IMAGE?.trim() ||
    "/default-og-image.png";

  return {
    title: siteName,
    description,
    keywords,
    openGraph: {
      title: siteName,
      description,
      images: [
        {
          url: ogImage,
        },
      ],
      type: "website",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [ogImage],
    },
  };
}

// Main App Layout with Providers
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings: Partial<SettingsInterface> = await getSettings();

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SettingsProvider settings={settings}>
          <LayoutContent>{children}</LayoutContent>
        </SettingsProvider>
      </body>
    </html>
  );
}
