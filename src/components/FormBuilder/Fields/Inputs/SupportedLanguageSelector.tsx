"use client";
import React, { CSSProperties } from "react";
import { Select } from "antd";
import { defaultWrapperStyle, defaultSelectStyle } from "../../InputStyle";
import { getFlagUrl } from "@/config/navigations/IconMapper";

interface SupportedLanguageSelectorProps {
  value?: string[];
  onChange?: (languages: string[]) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const { Option } = Select;

export const languageFlags: Record<string, string> = {
  en: "us",
  fr: "fr",
  de: "de",
  es: "es",
  zh: "cn",
  ja: "jp",
  ko: "kr",
  th: "th",
  my: "mm",
};

const SupportedLanguageSelector: React.FC<SupportedLanguageSelectorProps> = ({
  value = [],
  onChange,
  style = {},
  inputStyle = {},
}) => {
  // Always ensure 'en' is included
  const selectedLanguages = Array.from(new Set(["en", ...(value || [])]));

  const handleChange = (languages: string[]) => {
    // Prevent removing 'en' (English)
    const updatedLanguages = Array.from(new Set(["en", ...languages]));
    onChange?.(updatedLanguages);
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Select
        mode="multiple"
        placeholder="Select supported languages"
        value={selectedLanguages}
        onChange={handleChange}
        optionLabelProp="label"
        style={{ ...defaultSelectStyle, ...inputStyle }}
      >
        {Object.keys(languageFlags).map((lang) => {
          const countryCode = languageFlags[lang] || "un";
          const flagUrl = getFlagUrl(countryCode, 40);
          return (
            <Option
              key={lang}
              value={lang}
              disabled={lang === "en"}
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={flagUrl}
                    alt={lang}
                    style={{ width: 24, height: 16, marginRight: 8 }}
                  />
                  <span>{lang.toUpperCase()}</span>
                </span>
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                }}
              >
                <img
                  src={flagUrl}
                  alt={lang}
                  style={{ width: 24, height: 16, marginRight: 8 }}
                />
                <span>{lang.toUpperCase()}</span>
              </div>
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default SupportedLanguageSelector;
