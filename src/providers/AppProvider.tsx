"use client";

import React from "react";
import LayoutRouter from "@/router/LayoutRouter";
import SetupForm from "@/components/forms/SetupForm";
import { UserProvider } from "./UserProvider";
import { FileProvider } from "./FileProvider";
import { useSettings } from "@/hooks/useSettings";
import LoadingSpin from "@/components/loaders/LoadingSpin";
import { LanguageProvider } from "./LanguageProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { requiresSetup } = useSettings();

  if (requiresSetup === undefined) {
    return <LoadingSpin message="Loading settings..." />;
  }
  if (requiresSetup) {
    return <SetupForm />;
  }

  return (
    <LanguageProvider>
      <UserProvider>
        <FileProvider>
          <LayoutRouter>{children}</LayoutRouter>
        </FileProvider>
      </UserProvider>
    </LanguageProvider>
  );
};

export default AppProvider;
