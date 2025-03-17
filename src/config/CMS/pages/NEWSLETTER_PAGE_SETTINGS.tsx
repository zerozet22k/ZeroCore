import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
} from "../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "Newsletter";

export const NEWSLETTER_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  NEWSLETTER_SECTION: `${pageName}-newsletter-section`,
} as const;

export const NEWSLETTER_PAGE_SETTINGS: GeneralConfig<
  typeof NEWSLETTER_PAGE_SETTINGS_KEYS
> = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    label: "Page Content",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      title: {
        label: "Page Title",
        guide: "The main title of the newsletter page.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      subtitle: {
        label: "Page Subtitle",
        guide: "The subtitle of the newsletter page.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Page Description",
        guide: "A brief description of the newsletter page.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      backgroundImage: {
        label: "Background Image",
        guide: "The background image for the newsletter page.",
        formType: FormType.IMAGE_SELECTOR,
      },
    },
  },
  [NEWSLETTER_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    label: "Newsletter Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      maxNewslettersCount: {
        label: "Max Newsletters Count",
        guide: "Maximum number of newsletters displayed on the page.",
        formType: FormType.NUMBER,
      },
    },
  },
};

export type NEWSLETTER_PAGE_SETTINGS_TYPES = {
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    backgroundImage?: string;
  };
  [NEWSLETTER_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    maxNewslettersCount: number;
  };
};
