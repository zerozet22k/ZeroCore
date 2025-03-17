"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Button, message, Space, Spin } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/FormBuilder/CombinedField";
import { debounce } from "lodash";
import { useLanguageContext } from "@/contexts/LanguageContext";
import {
  PAGE_SETTINGS_GUIDE,
  pageGroupedKeys,
  PagesInterface,
  pageTabLabels,
} from "@/config/CMS/pages/pageKeys";

const PagesContent: React.FC = () => {
  const [pages, setPages] = useState<PagesInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modifiedPages, setModifiedPages] = useState<
    Partial<Record<keyof PagesInterface, any>>
  >({});

  const { setCurrentSupportedLanguages, supportedLanguages } =
    useLanguageContext();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<PagesInterface>("/pages");
      setPages(response.data);
      setCurrentSupportedLanguages(supportedLanguages);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      message.error("Failed to load pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const debouncedHandleInputChange = useMemo(
    () =>
      debounce((key: string, value: any) => {
        setModifiedPages((prev) => ({
          ...prev,
          [key]: value,
        }));

        setPages((prev) => {
          if (!prev) return null;
          const updatedPages = { ...prev };

          const keys = key.split(".") as (keyof PagesInterface)[];
          let target: any = updatedPages;

          keys.forEach((k, idx) => {
            if (idx === keys.length - 1) {
              target[k] = value;
            } else {
              if (!target[k]) target[k] = {};
              target = target[k];
            }
          });

          return updatedPages;
        });
      }, 50),
    []
  );

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedPages = { ...pages, ...modifiedPages };
      await apiClient.put("/pages", { pages: updatedPages });
      setModifiedPages({});
      message.success("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save page content:", error);
      message.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = (keys: (keyof PagesInterface)[]) => {
    if (!pages) {
      return <p>No data available for these pages.</p>;
    }
    return keys.map((key) => {
      const value = pages[key];
      const config = PAGE_SETTINGS_GUIDE[key];
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

  const tabsItems = Object.entries(pageGroupedKeys).map(([key, keys]) => ({
    key,
    label: pageTabLabels[key],
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
      <Tabs defaultActiveKey="HomePage" items={tabsItems} />

      <Space style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={Object.keys(modifiedPages).length === 0 || saving}
          loading={saving}
        >
          Save All Changes
        </Button>
      </Space>
    </div>
  );
};

export default PagesContent;
