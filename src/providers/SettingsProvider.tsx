"use client";

import { ReactNode, useMemo, useState, useCallback } from "react";
import {
  SettingsInterface,
  SETTINGS_KEYS,
  PublicKeys,
} from "@/config/CMS/settings/settingKeys";
import { DESIGN_SCHEMA_SETTINGS_KEYS } from "@/config/CMS/settings/keys/DESIGN_SCHEMA_KEYS";
import { LANGUAGE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/LANGUAGE_SETTINGS_KEYS";
import { PUSHER_SETTINGS_KEYS } from "@/config/CMS/settings/keys/PUSHER_SETTINGS_KEYS";
import apiClient from "@/utils/api/apiClient";
import { SettingsContext } from "@/contexts/SettingsContext";

const replacePublicSettings = (
  baseSettings: Partial<SettingsInterface>,
  newSettings: Partial<SettingsInterface>
): Partial<SettingsInterface> => {
  const updatedSettings: Partial<SettingsInterface> = { ...baseSettings };

  (Object.keys(newSettings) as PublicKeys[]).forEach((key) => {
    if ((key as keyof SettingsInterface) in SETTINGS_KEYS) {
      updatedSettings[key] = newSettings[key];
    }
  });

  return updatedSettings;
};

export const SettingsProvider: React.FC<{
  settings: Partial<SettingsInterface>;
  children: ReactNode;
}> = ({ settings, children }) => {
  const [currentSettings, setCurrentSettings] =
    useState<Partial<SettingsInterface>>(settings);

  const themeMode = useMemo(
    () =>
      currentSettings[DESIGN_SCHEMA_SETTINGS_KEYS.THEME]?.themeMode || "light",
    [currentSettings]
  );

  const requiresSetup = useMemo(() => {
    const siteSettings = currentSettings[
      SETTINGS_KEYS.SITE_SETTINGS as keyof SettingsInterface
    ] as any;
    return !siteSettings?.siteName?.trim() || !siteSettings?.siteUrl?.trim();
  }, [currentSettings]);

  const supportedLanguages = useMemo(() => {
    const languageSettings = currentSettings[
      LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES as keyof SettingsInterface
    ] as string[] | undefined;

    return Array.from(new Set(["en", ...(languageSettings || [])]));
  }, [currentSettings]);

  const pusherConfig = useMemo(() => {
    return currentSettings[PUSHER_SETTINGS_KEYS.PUSHER];
  }, [currentSettings]);

  const updateSettings = useCallback(
    (newSettings: Partial<SettingsInterface>) => {
      setCurrentSettings((prevSettings) => {
        return replacePublicSettings(prevSettings, newSettings);
      });
    },
    []
  );

  const fetchSettings = useCallback(async () => {
    try {
      const response = await apiClient.get("/settings/public");
      if (response && response.data) {
        setCurrentSettings((prevSettings) => {
          return replacePublicSettings(prevSettings, response.data);
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        themeMode,
        requiresSetup,
        supportedLanguages,
        updateSettings,
        fetchSettings,
        pusherConfig,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
