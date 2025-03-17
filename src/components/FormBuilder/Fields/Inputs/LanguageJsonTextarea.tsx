"use client";
import React from "react";
import { Input, Typography, theme } from "antd";
import { lighten, darken } from "polished";
import { defaultWrapperStyle, defaultInputStyle } from "../../InputStyle";
import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags } from "./SupportedLanguageSelector";

interface LanguageJsonTextareaProps {
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
}


const LanguageJsonTextarea: React.FC<LanguageJsonTextareaProps> = ({
  value = {},
  onChange,
}) => {
  const { currentSupportedLanguages } = useLanguage();
  const { token } = theme.useToken();

  const baseColor = token.colorBgContainer;
  const lightShade = lighten(0.05, baseColor);
  const darkShade = darken(0.1, baseColor);

  const handleChange = (lang: string, text: string) => {
    const updatedValue = { ...value, [lang]: text };
    onChange?.(updatedValue);
  };

  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        border: `2px dashed ${darkShade}`,
        borderRadius: "10px",
        backgroundColor: lightShade,
        position: "relative",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {currentSupportedLanguages.map((lang) => {
        const countryCode = languageFlags[lang] || "un";
        const flagUrl = getFlagUrl(countryCode, 40);

        return (
          <div
            key={lang}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <img
              src={flagUrl}
              alt={lang}
              style={{
                width: 24,
                height: 16,
                borderRadius: "2px",
                marginTop: "10px",
              }}
            />
            <Input.TextArea
              placeholder={`Enter text for ${lang.toUpperCase()}`}
              value={value[lang] || ""}
              onChange={(e) => handleChange(lang, e.target.value)}
              rows={4}
              style={{
                ...defaultInputStyle,
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: `1px solid ${token.colorBorder}`,
                backgroundColor: token.colorBgElevated,
                resize: "vertical",
                minHeight: "100px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LanguageJsonTextarea;
