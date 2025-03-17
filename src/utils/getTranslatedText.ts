export type LanguageJson = {
  en: string;
  [languageCode: string]: string;
};

export const getTranslatedText = (
  translations: LanguageJson | undefined,
  language: string
): string => {
  if (!translations) return "";
  return translations[language] || translations["en"] || "";
};
