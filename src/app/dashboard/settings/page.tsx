"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Button, message, Space, Spin } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/FormBuilder/CombinedField";
import {
  settingGroupedKeys,
  SETTINGS_GUIDE,
  SettingsInterface,
  settingTabLabels,
} from "@/config/CMS/settings/settingKeys";
import { LANGUAGE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/LANGUAGE_SETTINGS_KEYS";
import { debounce } from "lodash";
import { useLanguageContext } from "@/contexts/LanguageContext";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modifiedSettings, setModifiedSettings] = useState<
    Partial<Record<keyof SettingsInterface, any>>
  >({});

  const { setCurrentSupportedLanguages } = useLanguageContext();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<SettingsInterface>("/settings");
      setSettings(response.data);
      const languageSettings =
        response.data[LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES];
      if (languageSettings) {
        setCurrentSupportedLanguages(languageSettings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      message.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const debouncedHandleInputChange = useMemo(
    () =>
      debounce((key: string, value: any, type: string) => {
        const shouldDebounce = ["color"].includes(type);

        const updateSettings = () => {
          setModifiedSettings((prev) => ({
            ...prev,
            [key]: value,
          }));

          setSettings((prev) => {
            if (!prev) return null;

            const updatedSettings: SettingsInterface = { ...prev };
            const keys = key.split(".") as (keyof SettingsInterface)[];
            let target: any = updatedSettings;

            keys.forEach((k, idx) => {
              if (idx === keys.length - 1) {
                target[k] = value;
              } else {
                if (!target[k]) target[k] = {};
                target = target[k];
              }
            });

            // ✅ Dynamically update supported languages
            if (key === LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES) {
              setCurrentSupportedLanguages(value);
            }

            return updatedSettings;
          });
        };

        if (!shouldDebounce) {
          updateSettings();
        } else {
          debounce(updateSettings, 50)();
        }
      }, 50),
    [setCurrentSupportedLanguages]
  );

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...modifiedSettings };
      await apiClient.put("/settings", { settings: updatedSettings });
      setModifiedSettings({});
      message.success("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      message.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = (keys: (keyof SettingsInterface)[]) => {
    if (!settings) {
      return <p>No data available for these settings.</p>;
    }
    return keys.map((key) => {
      const value = settings[key];
      const config = SETTINGS_GUIDE[key];
      if (!config) return null;

      return (
        <CombinedField
          key={key}
          keyPrefix={key}
          config={config}
          values={value as Record<string, any>}
          onChange={debouncedHandleInputChange}
        />
      );
    });
  };

  const tabsItems = Object.entries(settingGroupedKeys).map(([key, keys]) => ({
    key,
    label: settingTabLabels[key],
    children: renderTabContent(keys),
  }));

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          height: "100vh",
          width: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Tabs defaultActiveKey="Global" items={tabsItems} />

      <Space style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={Object.keys(modifiedSettings).length === 0 || saving}
          loading={saving}
        >
          Save All Changes
        </Button>
      </Space>
    </div>
  );
};

export default SettingsPage;
