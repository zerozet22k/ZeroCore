export const dynamic = "force-dynamic";
import React from "react";
import NewsletterContent from "./content";
import PageService from "@/services/PageService";
import { NEWSLETTER_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/NEWSLETTER_PAGE_SETTINGS";

const getDefaultNewsletterData = () => ({
  [NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: {
      en: "Our Newsletters",
      my: "ကျွန်ုပ်တို့၏သတင်းစာများ",
    },
    subtitle: {
      en: "Stay Updated with Our Latest News",
      my: "နောက်ဆုံးရသတင်းများနှင့် အချက်အလက်များ",
    },
    description: {
      en: "Explore our collection of newsletters for the latest updates.",
      my: "နောက်ဆုံးရသတင်းများကို ရယူရန် ကျွန်ုပ်တို့၏သတင်းစာများကို ကြည့်ရှုပါ",
    },
    backgroundImage: "https://source.unsplash.com/1600x900/?newsletter",
  },
  [NEWSLETTER_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION]: {
    maxNewslettersCount: 8,
  },
});

const fetchNewsletterData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(NEWSLETTER_PAGE_SETTINGS_KEYS)
  );
  const defaultData = getDefaultNewsletterData();
  return { ...defaultData, ...fetchedData };
};

const NewsletterPage = async () => {
  const data = await fetchNewsletterData();
  return <NewsletterContent data={data} />;
};

export default NewsletterPage;
