import { LanguageContext, SupportedLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export function withLanguage<T extends { language?: SupportedLanguage }>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: Omit<T, "language">) {
    const { language } = useLanguage();
    return <Component {...(props as T)} language={language} />;
  };
}
