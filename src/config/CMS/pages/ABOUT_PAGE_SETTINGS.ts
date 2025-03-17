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

const pageName = "AboutUs";

export const ABOUT_PAGE_SETTINGS_KEYS = {
  PAGE_CONTENT: `${pageName}-page-content`,
  SECTIONS: `${pageName}-sections`,
  DESIGN: `${pageName}-design`,
} as const;

export const ABOUT_PAGE_SETTINGS: GeneralConfig<
  typeof ABOUT_PAGE_SETTINGS_KEYS
> = {
  [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
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

  [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: {
    label: "Page Design",
    type: NestedFieldType.JSON,
    design: JsonDesign.PARENT,
    fields: {
      columnCount: {
        label: "Column Count",
        guide: "Number of columns (1, 2, or 3) for grid layout.",
        formType: FormType.SIZE,
      },
      gridGutter: {
        label: "Grid Gutter Size",
        formType: FormType.SIZE,
      },
      cardStyle: {
        label: "Card Style",
        guide: "Choose the card styling.",
        formType: FormType.SELECT,
        options: [
          { label: "Default", value: "default" },
          { label: "Shadow", value: "shadow" },
          { label: "Borderless", value: "borderless" },
        ],
      },
      typography: {
        label: "Typography",
        guide: "Control font size and color.",
        type: NestedFieldType.JSON,
        design: JsonDesign.FLAT_OUTSIDE,
        fields: {
          titleSize: { label: "Title Size", formType: FormType.SIZE },
          descriptionSize: {
            label: "Description Size",
            formType: FormType.SIZE,
          },
          color: { label: "Text Color", formType: FormType.COLOR },
        },
      },
      animation: {
        label: "Animation Style",
        guide: "Choose entrance animation.",
        formType: FormType.SELECT,
        options: [
          { label: "None", value: "none" },
          { label: "Fade In", value: "fade-in" },
          { label: "Slide Up", value: "slide-up" },
          { label: "Scale In", value: "scale-in" },
        ],
      },
      showIcons: {
        label: "Show Icons",
        guide: "Toggle to show or hide icons in sections.",
        formType: FormType.BOOLEAN,
      },
      showImages: {
        label: "Show Images",
        guide: "Toggle to show or hide images in sections.",
        formType: FormType.BOOLEAN,
      },
      borderRadius: {
        label: "Border Radius",
        guide: "Adjust the roundness of section cards.",
        formType: FormType.SIZE,
      },
      textAlign: {
        label: "Text Alignment",
        guide: "Choose text alignment inside the cards.",
        formType: FormType.SELECT,
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    },
  },

  [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]: {
    label: "Sections",
    type: NestedFieldType.ARRAY,
    keyLabel: "Section",
    arrayDesign: ArrayDesign.CARD,
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
        label: "Section Title",
        guide: "Title for the section.",
        formType: FormType.LANGUAGE_JSON_TEXT,
      },
      description: {
        label: "Section Description",
        guide: "Brief description of the section.",
        formType: FormType.LANGUAGE_JSON_TEXTAREA,
      },
      icon: {
        label: "Icon",
        guide: "Choose an icon for the section.",
        formType: FormType.ICON_SELECTOR,
      },
      image: {
        label: "Image",
        guide: "Optional image for the section.",
        formType: FormType.IMAGE_SELECTOR,
      },
      sm: {
        label: "Small Screen (sm)",
        guide: "Column width for small screens (mobile).",
        formType: FormType.NUMBER,
      },
      md: {
        label: "Medium Screen (md)",
        guide: "Column width for medium screens (tablet).",
        formType: FormType.NUMBER,
      },
      lg: {
        label: "Large Screen (lg)",
        guide: "Column width for large screens (desktop).",
        formType: FormType.NUMBER,
      },
      xl: {
        label: "Extra Large Screen (xl)",
        guide: "Column width for extra-large screens (widescreen).",
        formType: FormType.NUMBER,
      },
    },
  },
};

export type ABOUT_PAGE_SETTINGS_TYPES = {
  [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    backgroundImage?: string;
  };
  [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: {
    columnCount: string;
    gridGutter: string;
    cardStyle: "default" | "shadow" | "borderless";
    typography: {
      titleSize: string;
      descriptionSize: string;
      color: string;
    };
    animation: "none" | "fade-in" | "slide-up" | "scale-in";
    showIcons: boolean;
    showImages: boolean;
    borderRadius: string;
    textAlign: "left" | "center" | "right";
  };
  [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]: {
    title: LanguageJson;
    description: LanguageJson;
    icon: string;
    image?: string;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }[];
};
