"use client";

import React from "react";
import AppProvider from "@/providers/AppProvider";
import CustomConfigProvider from "@/providers/CustomConfigProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { FileProvider } from "@/providers/FileProvider";
import { UserProvider } from "@/providers/UserProvider";

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  return (
    <CustomConfigProvider>
      <AppProvider>{children}</AppProvider>
    </CustomConfigProvider>
  );
};

export default LayoutContent;
