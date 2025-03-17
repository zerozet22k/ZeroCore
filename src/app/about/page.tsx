export const dynamic = "force-dynamic";

import React from "react";
import AboutUsContent from "./content";
import PageService from "@/services/PageService";
import {
  ABOUT_PAGE_SETTINGS_KEYS,
  ABOUT_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/ABOUT_PAGE_SETTINGS";

const getDefaultAboutUsData = (): ABOUT_PAGE_SETTINGS_TYPES => ({
  [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: {
      en: "Dedicated to Justice, Committed to Excellence.",
      my: "တရားမျှတမှုအတွက် မျှတမှုနှင့် ဝိုင်းဝန်းဆောင်ရွက်မှုကို အာရုံစိုက်သည်။",
    },
    subtitle: {
      en: "Delivering expert legal solutions with integrity and dedication.",
      my: "ကျွမ်းကျင်မှုနှင့် တာဝန်ခံမှုဖြင့် ဥပဒေရေးရာ ဖြေရှင်းမှုများကို ပေးဆောင်သည်။",
    },
    description: {
      en: "Our firm is committed to providing top-tier legal services tailored to meet the needs of our clients with professionalism and integrity.",
      my: "ကျွန်ုပ်တို့သည် ကျွမ်းကျင်မှုနှင့် တာဝန်ယူမှုဖြင့် ဥပဒေရေးရာဝန်ဆောင်မှုများကို ပေးဆောင်ပါသည်။",
    },
  },
  [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: {
    columnCount: "2",
    gridGutter: "32px",
    cardStyle: "shadow",
    typography: {
      titleSize: "3em",
      descriptionSize: "1.125em",
      color: "#333",
    },
    animation: "fade-in",
    showIcons: true,
    showImages: false,
    borderRadius: "12px",
    textAlign: "left",
  },
  [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]: [
    {
      title: { en: "Who We Are", my: "ကျွန်ုပ်တို့ဘယ်သူလဲ" },
      description: {
        en: "Welcome to our law firm. We are a team of dedicated legal professionals who strive to provide top-tier legal solutions to individuals and businesses alike. Our firm is built on a foundation of integrity, excellence, and unwavering commitment to justice.",
        my: "ကျွန်ုပ်တို့သည် အထူးပြုလုပ်သော ဥပဒေဆိုင်ရာ ဝန်ဆောင်မှုများကို ပေးဆောင်သော အသင်းဖြစ်ပါသည်။",
      },
      icon: "UserOutlined",
      sm: 24,
      md: 16,
      lg: 12,
      xl: 8,
    },
    {
      title: { en: "Our Mission", my: "ကျွန်ုပ်တို့၏ မစ်ရှင်" },
      description: {
        en: "Our mission is to deliver outstanding legal services with an emphasis on client satisfaction, professional integrity, and legal expertise.",
        my: "ကျွန်ုပ်တို့၏ မစ်ရှင်မှာ တရားမျှတမှုနှင့် ကျွမ်းကျင်မှုဖြင့် အထူးပြုလုပ်သော ဥပဒေဆိုင်ရာ ဝန်ဆောင်မှုများကို ပေးဆောင်ခြင်းဖြစ်သည်။",
      },
      icon: "FlagOutlined",
      sm: 12,
      md: 8,
      lg: 6,
      xl: 16,
    },
    {
      title: { en: "Our Values", my: "ကျွန်ုပ်တို့၏ တန်ဖိုးများ" },
      description: {
        en: "We uphold the highest standards of professionalism, honesty, and dedication.",
        my: "ကျွန်ုပ်တို့သည် အမြင့်မားဆုံး သမာဓိကို ထိန်းသိမ်းပြီး ကျွမ်းကျင်မှုနှင့် ရိုးသားမှုကို အာရုံစိုက်သည်။",
      },
      icon: "HeartOutlined",
      sm: 12,
      md: 8,
      lg: 6,
      xl: 24,
    },
  ],
});

const fetchAboutUsData = async (): Promise<ABOUT_PAGE_SETTINGS_TYPES> => {
  const pageService = new PageService();
  try {
    const fetchedData = await pageService.getPagesByKeys(
      Object.values(ABOUT_PAGE_SETTINGS_KEYS)
    );

    return {
      ...getDefaultAboutUsData(),
      ...fetchedData,
      [ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
        ...getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
        ...fetchedData[ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT],
      },
      [ABOUT_PAGE_SETTINGS_KEYS.DESIGN]: {
        ...getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN],
        ...(fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN] || {}),
        cardStyle: (fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.cardStyle ||
          "shadow") as "default" | "shadow" | "borderless",
        columnCount:
          fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.columnCount ||
          getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN].columnCount,
        gridGutter:
          fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.gridGutter ||
          getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN].gridGutter,
        borderRadius:
          fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.borderRadius ||
          getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN].borderRadius,
        typography: {
          ...getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]
            .typography,
          ...(fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.typography || {}),
          titleSize:
            fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.typography
              ?.titleSize ||
            getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN].typography
              .titleSize,
          descriptionSize:
            fetchedData[ABOUT_PAGE_SETTINGS_KEYS.DESIGN]?.typography
              ?.descriptionSize ||
            getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.DESIGN].typography
              .descriptionSize,
        },
      },
      [ABOUT_PAGE_SETTINGS_KEYS.SECTIONS]:
        fetchedData[ABOUT_PAGE_SETTINGS_KEYS.SECTIONS] ||
        getDefaultAboutUsData()[ABOUT_PAGE_SETTINGS_KEYS.SECTIONS],
    };
  } catch (error) {
    console.error("Failed to fetch About Us data:", error);
    return getDefaultAboutUsData();
  }
};

const AboutUsPage = async () => {
  const data = await fetchAboutUsData();
  return <AboutUsContent data={data} />;
};

export default AboutUsPage;
