"use client";
import { LanguageContext, SupportedLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import { ReactNode, useState, useEffect } from "react";

const LANGUAGE_STORAGE_KEY = "selected_language";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { supportedLanguages } = useSettings();

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage) ||
        supportedLanguages[0] ||
        "en"
      );
    }
    return supportedLanguages[0] || "en";
  });

  const [currentSupportedLanguages, setCurrentSupportedLanguages] =
    useState<SupportedLanguage[]>(supportedLanguages);

  const setLanguage = (lang: SupportedLanguage) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    if (!supportedLanguages.includes(language)) {
      setLanguage(supportedLanguages[0] || "en");
    }

    setCurrentSupportedLanguages(supportedLanguages);
  }, [supportedLanguages, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages,
        currentSupportedLanguages,
        setCurrentSupportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
