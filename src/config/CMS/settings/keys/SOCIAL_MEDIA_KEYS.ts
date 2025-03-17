import { FormType, GeneralConfig, JsonDesign, NestedFieldType } from "..";

// SOCIAL_MEDIA_KEYS - Flat keys for database storage
export const SOCIAL_MEDIA_SETTINGS_KEYS = {
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  GITHUB: "github",
  TIKTOK: "tiktok",
  YOUTUBE: "youtube",
  REDDIT: "reddit",
  WHATSAPP: "whatsapp",
  WECHAT: "wechat",
  DRIBBBLE: "dribbble",
  BEHANCE: "behance",
  MEDIUM: "medium",
} as const;

export const SOCIAL_MEDIA_SETTINGS: GeneralConfig<
  typeof SOCIAL_MEDIA_SETTINGS_KEYS
> = {
  [SOCIAL_MEDIA_SETTINGS_KEYS.FACEBOOK]: {
    label: "Facebook Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Facebook URL",
        guide: "This is the URL for your Facebook page.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.TWITTER]: {
    label: "Twitter Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Twitter URL",
        guide: "This is the URL for your Twitter profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.INSTAGRAM]: {
    label: "Instagram Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Instagram URL",
        guide: "This is the URL for your Instagram profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.LINKEDIN]: {
    label: "LinkedIn Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "LinkedIn URL",
        guide: "This is the URL for your LinkedIn profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.GITHUB]: {
    label: "GitHub Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "GitHub URL",
        guide: "This is the URL for your GitHub profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.TIKTOK]: {
    label: "TikTok Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "TikTok URL",
        guide: "This is the URL for your TikTok profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.YOUTUBE]: {
    label: "YouTube Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "YouTube URL",
        guide: "This is the URL for your YouTube channel.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.REDDIT]: {
    label: "Reddit Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Reddit URL",
        guide: "This is the URL for your Reddit profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.WHATSAPP]: {
    label: "WhatsApp Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "WhatsApp Link",
        guide: "This is the WhatsApp contact link.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.WECHAT]: {
    label: "WeChat Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "WeChat Profile URL",
        guide: "This is the URL for your WeChat profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.DRIBBBLE]: {
    label: "Dribbble Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Dribbble URL",
        guide: "This is the URL for your Dribbble profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.BEHANCE]: {
    label: "Behance Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Behance URL",
        guide: "This is the URL for your Behance profile.",
        formType: FormType.URL,
      },
    },
  },
  [SOCIAL_MEDIA_SETTINGS_KEYS.MEDIUM]: {
    label: "Medium Settings",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    visibility: "public",
    fields: {
      url: {
        label: "Medium URL",
        guide: "This is the URL for your Medium profile.",
        formType: FormType.URL,
      },
    },
  },
};

export type SOCIAL_MEDIA_SETTINGS_TYPES = {
  [SOCIAL_MEDIA_SETTINGS_KEYS.FACEBOOK]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.TWITTER]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.INSTAGRAM]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.LINKEDIN]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.GITHUB]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.TIKTOK]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.YOUTUBE]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.REDDIT]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.WHATSAPP]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.WECHAT]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.DRIBBBLE]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.BEHANCE]: { url: string };
  [SOCIAL_MEDIA_SETTINGS_KEYS.MEDIUM]: { url: string };
};
