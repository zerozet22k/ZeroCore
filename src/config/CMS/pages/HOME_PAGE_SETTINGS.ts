import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  ArrayDesign,
  ArrayFunctionality,
  ModalBehaviorType,
  TextAlign,
  ChildArrayDesign,
  ResponsiveImagesType,
} from "../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "Home";

export const HOME_PAGE_SETTINGS_KEYS = {
  HERO_BANNER: `${pageName}-hero-banner`,
  CONTACT_US: `${pageName}-contact-us`,
  TESTIMONIALS: `${pageName}-testimonials`,
  ADS: `${pageName}-ads`,
  FAQS: `${pageName}-faqs`,
  CARDS: `${pageName}-cards`,
} as const;

export const HOME_PAGE_SETTINGS: GeneralConfig<typeof HOME_PAGE_SETTINGS_KEYS> =
  {
    [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: {
      label: "Hero Banners",
      type: NestedFieldType.ARRAY,
      keyLabel: "Banner",
      arrayDesign: ArrayDesign.PARENT,
      arrayFunctionalities: [
        ArrayFunctionality.SORTABLE,
        ArrayFunctionality.FILTERABLE,
      ],
      childArrayDesign: ChildArrayDesign.TABLE,
      modalBehavior: {
        [ModalBehaviorType.OPEN_IN_MODAL]: false,
        [ModalBehaviorType.ITEM_MODAL]: true,
      },
      fields: {
        images: {
          label: "Banner Images",
          guide: "Images for desktop/tablet/mobile.",
          formType: FormType.RESPONSIVE_IMAGES,
        },
        header: {
          label: "Banner Header",
          guide: "Main headline text for this banner.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Banner Description",
          guide: "Optional description text for this banner.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        textAlign: {
          label: "Text Alignment",
          guide: "Position the text (left or right).",
          formType: FormType.SELECT,
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
      label: "Contact Us Information",
      type: NestedFieldType.JSON,
      design: JsonDesign.PARENT,
      visibility: "public",
      fields: {
        address: {
          label: "Contact Address",
          guide: "The physical address for contact.",
          formType: FormType.TEXT,
        },
        phone: {
          label: "Contact Phone",
          guide: "The phone number for contact.",
          formType: FormType.TEXT,
        },
        email: {
          label: "Contact Email",
          guide: "The email address for contact.",
          formType: FormType.TEXT,
        },
        mapLink: {
          label: "Google Maps Link",
          guide: "Embed link for the Google Maps location.",
          formType: FormType.TEXT,
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS]: {
      label: "Testimonials",
      type: NestedFieldType.ARRAY,
      keyLabel: "Testimonial",
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
        name: {
          label: "Name",
          guide: "The name of the person providing the testimonial.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        comment: {
          label: "Comment",
          guide: "The testimonial comment.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.ADS]: {
      label: "Homepage Ads",
      type: NestedFieldType.ARRAY,
      keyLabel: "Ad",
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
        image: {
          label: "Ad Image",
          guide: "Image for the advertisement.",
          formType: FormType.IMAGE_SELECTOR,
        },
        title: {
          label: "Ad Title",
          guide: "Title of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        subtitle: {
          label: "Ad Subtitle",
          guide: "Subtitle of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Ad Description",
          guide: "Description of the advertisement.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        contacts: {
          label: "Contact Numbers",
          type: NestedFieldType.ARRAY,
          keyLabel: "Contact",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          arrayFunctionalities: [ArrayFunctionality.SORTABLE],
          fields: {
            name: {
              label: "Contact Name",
              guide: "Name of the contact for the ad.",
              formType: FormType.TEXT,
            },
            number: {
              label: "Phone Number",
              guide: "Phone number for the ad contact.",
              formType: FormType.TEXT,
            },
          },
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.FAQS]: {
      label: "Frequently Asked Questions",
      type: NestedFieldType.ARRAY,
      keyLabel: "FAQ",
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
        question: {
          label: "Question",
          guide: "The frequently asked question.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        answer: {
          label: "Answer",
          guide: "The answer to the FAQ.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
      },
    },

    [HOME_PAGE_SETTINGS_KEYS.CARDS]: {
      label: "Info Cards",
      type: NestedFieldType.ARRAY,
      keyLabel: "Card",
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
          label: "Card Title",
          guide: "Title for the information card.",
          formType: FormType.LANGUAGE_JSON_TEXT,
        },
        description: {
          label: "Card Description",
          guide: "Short description for the information card.",
          formType: FormType.LANGUAGE_JSON_TEXTAREA,
        },
        images: {
          label: "Card Images",
          type: NestedFieldType.ARRAY,
          keyLabel: "Image",
          arrayDesign: ArrayDesign.FLAT_OUTSIDE,
          fields: {
            imageUrl: {
              label: "Image URL",
              guide: "Image Url for the image",
              formType: FormType.IMAGE_SELECTOR,
            },
          },
        },
      },
    },
  };

export type HOME_PAGE_SETTINGS_TYPES = {
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: {
    images: ResponsiveImagesType;
    header: LanguageJson;
    description: LanguageJson;
    textAlign: TextAlign;
  }[];

  [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
    address: string;
    phone: string;
    email: string;
    mapLink: string;
  };

  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS]: {
    name: LanguageJson;
    comment: LanguageJson;
  }[];

  [HOME_PAGE_SETTINGS_KEYS.ADS]: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    contacts: {
      name: string;
      number: string;
    }[];
    image: string;
  }[];

  [HOME_PAGE_SETTINGS_KEYS.FAQS]: {
    question: LanguageJson;
    answer: LanguageJson;
  }[];

  [HOME_PAGE_SETTINGS_KEYS.CARDS]: {
    title: LanguageJson;
    description: LanguageJson;
    images: {
      imageUrl: string;
    }[];
  }[];
};
