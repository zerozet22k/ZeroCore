export const dynamic = "force-dynamic";
import React from "react";
import ServicesContent from "./content";
import PageService from "@/services/PageService";
import { SERVICES_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/SERVICES_PAGE_SETTINGS";

const getDefaultServiceData = () => ({
  [SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: {
      en: "Our Legal Services",
      my: "ကျွန်ုပ်တို့၏ ဥပဒေဆိုင်ရာ ဝန်ဆောင်မှုများ",
    },
    subtitle: {
      en: "Tailored Solutions for Your Legal Needs",
      my: "သင့်ဥပဒေလိုအပ်ချက်များအတွက် အထူးသင့်လျှော်သည့် ဖြေရှင်းချက်များ",
    },
    description: {
      en: "Comprehensive legal solutions designed to meet all your needs.",
      my: "သင့်လိုအပ်ချက်များအတွက် ပြည့်စုံသော ဥပဒေဆိုင်ရာ ဝန်ဆောင်မှုများ။",
    },
    backgroundImage: "https://source.unsplash.com/1600x900/?law,justice,legal",
  },
  [SERVICES_PAGE_SETTINGS_KEYS.SERVICES_LIST]: [
    {
      title: { en: "Corporate Law", my: "ကုမ္ပဏီဥပဒေ" },
      description: {
        en: "Expert legal guidance on business formations, contracts, and compliance.",
        my: "စီးပွားရေးဖွဲ့စည်းပုံများ၊ စာချုပ်များနှင့်လိုက်နာမှုအတွက် ကျွမ်းကျင်သောဥပဒေညွှန်ကြားမှု။",
      },
      icon: "BankOutlined",
      iconColor: "#1890ff",
    },
  ],
});

const fetchServicesData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(SERVICES_PAGE_SETTINGS_KEYS)
  );

  const defaultData = getDefaultServiceData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };

  return mergedData;
};

const ServicesPage = async () => {
  const data = await fetchServicesData();
  return <ServicesContent data={data} />;
};

export default ServicesPage;
