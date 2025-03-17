import React from "react";
import HomePageContent from "./content";
import PageService from "@/services/PageService";
import { HOME_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/HOME_PAGE_SETTINGS";

// ✅ Function for default homepage data
const getDefaultHomePageData = () => ({
  [HOME_PAGE_SETTINGS_KEYS.HERO_BANNER]: [
    {
      images: {
        desktop: "/images/bagan.jpg",
        tablet: "/images/bagan-tablet.jpg",
        mobile: "/images/bagan-mobile.jpg",
      },
      header: {
        en: "We Know Myanmar Business",
        my: "မြန်မာနိုင်ငံရှိ စီးပွားရေးလုပ်ငန်းများအတွက် ကျွမ်းကျင်သော ဝန်ဆောင်မှုများ",
      },
      description: {
        en: "Helping businesses navigate legal, tax, and audit processes.",
        my: "ဥပဒေ၊ အခွန်နှင့် စစ်ဆေးမှုများကို ဦးတည်စွာ ကူညီပေးခြင်း။",
      },
      textAlign: "left",
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.CONTACT_US]: {
    address: "123 Main Street, Yangon, Myanmar",
    phone: "+95 9 123456789",
    email: "contact@lincolnmyanmar.com",
    mapLink: "https://maps.google.com",
  },
  [HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS]: [
    {
      name: {
        en: "John Doe",
        my: "ဂျွန် ဒိုး",
      },
      comment: {
        en: "Excellent service with professional legal advice.",
        my: "အထူးသင့်တော်သော ဥပဒေ အကြံပေးဝန်ဆောင်မှုများ။",
      },
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.ADS]: [
    {
      title: { en: "Special Offer", my: "အထူးလျှော့စျေး" },
      subtitle: { en: "Limited Time Only", my: "ကန့်သတ်ချိန်အတွင်း" },
      description: {
        en: "Get a free consultation for your first visit.",
        my: "ပထမဆုံး အကြိမ်လာရောက်သော အချိန်အတွက် အခမဲ့ အကြံပေးမှု။",
      },
      contacts: [{ name: "Office", number: "+95 9 987654321" }],
      image: "/images/special-offer.jpg",
    },
  ],
  [HOME_PAGE_SETTINGS_KEYS.FAQS]: [
    {
      question: {
        en: "What services do you offer?",
        my: "သင်ဘာဝန်ဆောင်မှုများပေးသလဲ?",
      },
      answer: {
        en: "We provide expert legal, tax, and audit services for businesses in Myanmar.",
        my: "ကျွန်ုပ်တို့သည် မြန်မာနိုင်ငံရှိ လုပ်ငန်းများအတွက် ဥပဒေ၊ အခွန်၊ နှင့် စစ်ဆေးမှုဝန်ဆောင်မှုများပေးပါသည်။",
      },
    },
    {
      question: {
        en: "How can I contact you?",
        my: "သင့်ကိုဘယ်လိုဆက်သွယ်ရမလဲ?",
      },
      answer: {
        en: "You can reach us via phone at 0951515 or email at info@lincolnmyanmar.com.",
        my: "သင်သည် 0951515 တွင် ဖုန်းဖြင့် သို့မဟုတ် info@lincolnmyanmar.com သို့ အီးမေးလ်ဖြင့် ဆက်သွယ်နိုင်ပါသည်။",
      },
    },
  ],
});

const fetchHomePageData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(HOME_PAGE_SETTINGS_KEYS)
  );
  const defaultData = getDefaultHomePageData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };

  return mergedData;
};

// ✅ HomePage component
const HomePage = async () => {
  const data = await fetchHomePageData();
  return <HomePageContent data={data} />;
};

export default HomePage;
