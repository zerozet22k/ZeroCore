import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
} from "../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "Team";

export const TEAM_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  TEAM_SECTION: `${pageName}-team-section`,
} as const;

export const TEAM_PAGE_SETTINGS: GeneralConfig<typeof TEAM_PAGE_SETTINGS_KEYS> =
  {
    [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
      label: "Page Content",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        title: {
          label: "Page Title",
          guide: "The main title of the team page.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        subtitle: {
          label: "Page Subtitle",
          guide: "The subtitle of the team page.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Page Description",
          guide: "A brief description of the team page.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        backgroundImage: {
          label: "Background Image",
          guide: "The background image for the team page.",
          formType: FormType.IMAGE_SELECTOR,
        },
      },
    },

    [TEAM_PAGE_SETTINGS_KEYS.TEAM_SECTION]: {
      label: "Team Section",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      fields: {
        maxMembersCount: {
          label: "Max Team Members Count",
          guide: "Maximum number of team members displayed.",
          formType: FormType.NUMBER,
        },
        memberRole: {
          label: "Member Role",
          guide: "Select the role assigned to team members.",
          formType: FormType.ROLE_SELECTOR,
        },
      },
    },
  };

export type TEAM_PAGE_SETTINGS_TYPES = {
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    backgroundImage?: string;
  };
  [TEAM_PAGE_SETTINGS_KEYS.TEAM_SECTION]: {
    maxMembersCount: number;
    memberRole: string;
  };
};
