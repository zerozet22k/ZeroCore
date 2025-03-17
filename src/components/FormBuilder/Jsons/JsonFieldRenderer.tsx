"use client";
import React, { CSSProperties, useState } from "react";
import { Button, theme } from "antd";
import { darken } from "polished";

import {
  JsonDesign,
  JsonFunctionality,
  ModalBehaviorType,
  NestedJsonField,
  ChildNestedJsonField,
} from "@/config/CMS/settings";
import JsonDesignRenderer from "./JsonDesignRenderer";
import JsonChildDesignRenderer from "./JsonChildDesignRenderer";
import CombinedField from "../CombinedField";
import JSON5 from "json5";
import { mergeJsonByConfig } from "@/config/CMS/settings";

type JsonFieldRendererProps = {
  config: NestedJsonField | ChildNestedJsonField;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  style?: CSSProperties;
  zIndex?: number;
};

const JsonFieldRenderer: React.FC<JsonFieldRendererProps> = ({
  config,
  value,
  onChange,
  style = {},
  zIndex = 1000,
}) => {
  const { token } = theme.useToken();
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);

  const modalBehavior = config.modalBehavior || {};
  const design: JsonDesign = config.design || JsonDesign.CARD;
  const functionalities: JsonFunctionality[] = config.jsonFunctionalities || [];

  // Helper function to parse key = value formatted text.
  const parseKeyValueFormat = (text: string): Record<string, any> => {
    const lines = text.split(/\r?\n/);
    const result: Record<string, any> = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const raw = match[2].trim();
        let val: string | number;
        if (
          (raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith("'") && raw.endsWith("'"))
        ) {
          val = raw.slice(1, -1);
        } else if (!isNaN(Number(raw))) {
          val = Number(raw);
        } else {
          val = raw;
        }
        result[match[1]] = val;
      }
    }
    return result;
  };

  const handlePasteJson = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      let parsed;
      try {
        // First try to parse as JSON5.
        parsed = JSON5.parse(clipboardText);
      } catch (jsonError) {
        // If JSON5 fails, fall back to custom key=value parsing.
        parsed = parseKeyValueFormat(clipboardText);
      }
      if (typeof parsed === "object" && parsed !== null) {
        const mergedValue = mergeJsonByConfig(value, parsed, config);
        onChange(mergedValue);
      }
    } catch (error) {
      console.error("Failed to paste JSON or JSON5", error);
    }
  };

  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const renderItem = () => (
    <>
      {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => (
        <JsonChildDesignRenderer
          key={fieldKey}
          label={fieldConfig.label}
          itemKey={fieldKey}
          config={fieldConfig}
          values={value?.[fieldKey]}
          handleFieldChange={handleFieldChange}
          modalBehavior={modalBehavior}
          childModalState={[activeItemKey, setActiveItemKey]}
          zIndex={zIndex}
        />
      ))}
    </>
  );

  return (
    <JsonDesignRenderer
      design={design}
      label={config.label}
      guide={config.guide}
      value={value}
      renderItem={renderItem}
      style={style}
      modalBehavior={modalBehavior}
      modalState={[false, () => {}]}
      zIndex={zIndex}
      extra={
        functionalities.includes(JsonFunctionality.INTELLIGENT) && (
          <Button
            onClick={handlePasteJson}
            style={{
              backgroundColor: token.colorPrimary,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              boxShadow: `0 2px 6px ${darken(0.1, token.colorBgContainer)}`,
            }}
          >
            Paste JSON
          </Button>
        )
      }
    />
  );
};

export default JsonFieldRenderer;
