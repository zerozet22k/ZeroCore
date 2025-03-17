import { FormType, GeneralConfig, JsonDesign, NestedFieldType } from "..";

export const SEO_SETTINGS_KEYS = {
  SEO_SETTINGS: "seoSettings",
} as const;

export const SEO_SETTINGS: GeneralConfig<typeof SEO_SETTINGS_KEYS> = {
  [SEO_SETTINGS_KEYS.SEO_SETTINGS]: {
    label: "SEO Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    design: JsonDesign.PARENT,
    fields: {
      metaTitle: {
        label: "Meta Title",
        guide: "This is the title displayed in search engines.",
        formType: FormType.TEXT,
      },
      metaDescription: {
        label: "Meta Description",
        guide: "This is the description displayed in search engines.",
        formType: FormType.TEXTAREA,
      },
      ogImage: {
        label: "Open Graph Image",
        guide: "Image URL for social media previews (1200x630 recommended).",
        formType: FormType.IMAGE_SELECTOR,
      },
      keywords: {
        label: "Keywords",
        guide: "Comma-separated keywords for SEO.",
        formType: FormType.TEXTAREA,
      },
    },
  },
};

export type SEO_SETTINGS_TYPES = {
  [SEO_SETTINGS_KEYS.SEO_SETTINGS]: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
};
