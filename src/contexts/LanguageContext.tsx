import React, { createContext, useContext, ReactNode } from "react";

export type SupportedLanguage = string;

export const LanguageContext = createContext<{
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: SupportedLanguage[];
  currentSupportedLanguages: SupportedLanguage[];
  setCurrentSupportedLanguages: (langs: SupportedLanguage[]) => void;
} | null>(null);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};
