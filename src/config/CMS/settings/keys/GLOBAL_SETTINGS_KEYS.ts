import { FormType, GeneralConfig, NestedFieldType, JsonDesign } from "..";

export const GLOBAL_SETTINGS_KEYS = {
  SITE_SETTINGS: "siteSettings",
} as const;

export const GLOBAL_SETTINGS: GeneralConfig<typeof GLOBAL_SETTINGS_KEYS> = {
  [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
    label: "Site Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    design: JsonDesign.PARENT,
    fields: {
      siteName: {
        label: "Site Name",
        guide: "The name of your site.",
        formType: FormType.TEXT,
      },
      siteUrl: {
        label: "Site URL",
        guide: "The URL of your site.",
        formType: FormType.URL,
      },
      siteLogo: {
        label: "Site Logo",
        guide: "The logo image for your site.",
        formType: FormType.IMAGE_SELECTOR,
      },
    },
  },
};

export type GLOBAL_SETTINGS_TYPES = {
  [GLOBAL_SETTINGS_KEYS.SITE_SETTINGS]: {
    siteName: string;
    siteUrl: string;
    siteBanner: string;
    siteLogo: string;
  };
};
