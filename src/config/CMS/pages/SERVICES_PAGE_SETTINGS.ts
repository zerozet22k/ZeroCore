import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  ModalBehaviorType,
} from "../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "Services";

export const SERVICES_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  SERVICES_LIST: `${pageName}-services-list`,
} as const;

export const SERVICES_PAGE_SETTINGS: GeneralConfig<
  typeof SERVICES_PAGE_SETTINGS_KEYS
> = {
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    label: "Page Content",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      title: {
        label: "Page Title",
        guide: "The main title of the services page.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      subtitle: {
        label: "Page Subtitle",
        guide: "The subtitle of the services page.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Page Description",
        guide: "A brief description of the services page.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      backgroundImage: {
        label: "Background Image",
        guide: "The background image for the services page.",
        formType: FormType.IMAGE_SELECTOR,
      },
    },
  },

  [SERVICES_PAGE_SETTINGS_KEYS.SERVICES_LIST]: {
    label: "Services List",
    type: NestedFieldType.ARRAY,
    keyLabel: "Service",
    arrayDesign: ArrayDesign.PARENT,
    arrayFunctionalities: [
      ArrayFunctionality.SORTABLE,
      ArrayFunctionality.FILTERABLE,
    ],
    modalBehavior: {
      [ModalBehaviorType.OPEN_IN_MODAL]: false,
      [ModalBehaviorType.ITEM_MODAL]: true,
    },
    fields: {
      title: {
        label: "Service Title",
        guide: "Title for the service.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Service Description",
        guide: "Brief description of the service.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      icon: {
        label: "Service Icon",
        guide: "Select an icon for the service.",
        formType: FormType.ICON_SELECTOR,
      },
      iconColor: {
        label: "Icon Color",
        guide: "Color of the service icon.",
        formType: FormType.COLOR,
      },
    },
  },
};

export type SERVICES_PAGE_SETTINGS_TYPES = {
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    backgroundImage?: string;
  };
  [SERVICES_PAGE_SETTINGS_KEYS.SERVICES_LIST]: {
    title: LanguageJson;
    description: LanguageJson;
    icon: string;
    iconColor: string;
  }[];
};
