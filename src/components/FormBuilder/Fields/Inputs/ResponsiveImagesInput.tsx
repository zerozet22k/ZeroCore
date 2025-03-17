"use client";
import React, { CSSProperties } from "react";
import { Typography, theme } from "antd";
import { lighten, darken } from "polished";

import ImageSelector from "./ImageSelector";

interface ResponsiveImagesValue {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

interface ResponsiveImagesInputProps {
  value?: ResponsiveImagesValue;
  onChange?: (value: ResponsiveImagesValue) => void;
  style?: CSSProperties;
}

/**
 * Renders three image selectors for desktop / tablet / mobile in one field
 */
const ResponsiveImagesInput: React.FC<ResponsiveImagesInputProps> = ({
  value = {},
  onChange,
  style,
}) => {
  const { token } = theme.useToken();

  const baseColor = token.colorBgContainer;
  const lightShade = lighten(0.05, baseColor);
  const darkShade = darken(0.1, baseColor);

  const handleChange = (key: keyof ResponsiveImagesValue, url: string) => {
    onChange?.({
      ...value,
      [key]: url,
    });
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
        gap: "12px",
        ...style,
      }}
    >
      <Typography.Text strong>Desktop Image</Typography.Text>
      <ImageSelector
        value={value.desktop || ""}
        onChange={(url) => handleChange("desktop", url)}
      />

      <Typography.Text strong>Tablet Image</Typography.Text>
      <ImageSelector
        value={value.tablet || ""}
        onChange={(url) => handleChange("tablet", url)}
      />

      <Typography.Text strong>Mobile Image</Typography.Text>
      <ImageSelector
        value={value.mobile || ""}
        onChange={(url) => handleChange("mobile", url)}
      />
    </div>
  );
};

export default ResponsiveImagesInput;
