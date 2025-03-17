import React, { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useSettings } from "@/hooks/useSettings";

interface CustomConfigProviderProps {
  children: React.ReactNode;
}

const CustomConfigProvider: React.FC<CustomConfigProviderProps> = ({
  children,
}) => {
  const { themeMode } = useSettings();

  let algorithm;

  switch (themeMode) {
    case "dark":
      algorithm = theme.darkAlgorithm;
      break;
    case "compact-light":
      algorithm = theme.compactAlgorithm;
      break;
    case "light":
    default:
      algorithm = theme.defaultAlgorithm;
      break;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default CustomConfigProvider;
