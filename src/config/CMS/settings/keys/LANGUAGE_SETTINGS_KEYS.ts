import { FormType, GeneralConfig } from "..";

export const LANGUAGE_SETTINGS_KEYS = {
  SUPPORTED_LANGUAGES: "supportedLanguages",
} as const;

export const LANGUAGE_SETTINGS: GeneralConfig<typeof LANGUAGE_SETTINGS_KEYS> = {
  [LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES]: {
    label: "Supported Languages",
    guide: "Select the languages your site supports.",
    visibility: "public",
    formType: FormType.SUPPORTED_LANGUAGE_SELECTOR,
  },
};

export type LANGUAGE_SETTINGS_TYPES = {
  [LANGUAGE_SETTINGS_KEYS.SUPPORTED_LANGUAGES]: string[];
};
