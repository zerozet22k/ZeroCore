export const dynamic = "force-dynamic";
import React from "react";
import TeamContent from "./content";
import PageService from "@/services/PageService";
import { TEAM_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/TEAM_PAGE_SETTINGS";

const getDefaultTeamData = () => ({
  [TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
    title: {
      en: "Meet Our Team",
      my: "ကျွန်ုပ်တို့၏အသင်းသားများကို တွေ့ပါ",
    },
    subtitle: {
      en: "Our dedicated professionals",
      my: "ကျွန်ုပ်တို့၏အဓိကပညာရှင်များ",
    },
    description: {
      en: "Learn more about the team behind our success.",
      my: "ကျွန်ုပ်တို့၏အောင်မြင်မှုအတွက်အဖွဲ့၏အကြောင်းကို သိရှိပါ",
    },
    backgroundImage: "https://source.unsplash.com/1600x900/?team,office",
  },
  [TEAM_PAGE_SETTINGS_KEYS.TEAM_SECTION]: {
    maxMembersCount: 8,
  },
});

const fetchTeamData = async () => {
  const pageService = new PageService();
  const fetchedData = await pageService.getPagesByKeys(
    Object.values(TEAM_PAGE_SETTINGS_KEYS)
  );
  const defaultData = getDefaultTeamData();
  const mergedData = {
    ...defaultData,
    ...fetchedData,
  };
  return mergedData;
};

const TeamMembersPage = async () => {
  const data = await fetchTeamData();
  return <TeamContent data={data} />;
};

export default TeamMembersPage;
