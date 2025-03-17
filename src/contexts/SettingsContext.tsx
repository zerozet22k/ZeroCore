"use client";

import { createContext } from "react";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { PUSHER_SETTINGS_KEYS } from "@/config/CMS/settings/keys/PUSHER_SETTINGS_KEYS";

interface SettingsContextProps {
  settings: Partial<SettingsInterface>;
  themeMode: "light" | "dark" | "compact-light";
  requiresSetup: boolean;
  supportedLanguages: string[];
  updateSettings: (newSettings: Partial<SettingsInterface>) => void;
  fetchSettings: () => Promise<void>;
  pusherConfig?: SettingsInterface[typeof PUSHER_SETTINGS_KEYS.PUSHER];
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);
