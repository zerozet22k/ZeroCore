import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS,
  HOME_PAGE_SETTINGS_TYPES,
} from "./HOME_PAGE_SETTINGS";

import {
  SERVICES_PAGE_SETTINGS_KEYS,
  SERVICES_PAGE_SETTINGS,
  SERVICES_PAGE_SETTINGS_TYPES,
} from "./SERVICES_PAGE_SETTINGS";

import {
  ABOUT_PAGE_SETTINGS_KEYS,
  ABOUT_PAGE_SETTINGS,
  ABOUT_PAGE_SETTINGS_TYPES,
} from "./ABOUT_PAGE_SETTINGS";

import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "./TEAM_PAGE_SETTINGS";

import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  NEWSLETTER_PAGE_SETTINGS,
  NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "./NEWSLETTER_PAGE_SETTINGS";

export const PAGE_SETTINGS_KEYS = {
  ...HOME_PAGE_SETTINGS_KEYS,
  ...SERVICES_PAGE_SETTINGS_KEYS,
  ...ABOUT_PAGE_SETTINGS_KEYS,
  ...TEAM_PAGE_SETTINGS_KEYS,
  ...NEWSLETTER_PAGE_SETTINGS_KEYS,
} as const;

export const PAGE_SETTINGS_GUIDE = {
  ...HOME_PAGE_SETTINGS,
  ...SERVICES_PAGE_SETTINGS,
  ...ABOUT_PAGE_SETTINGS,
  ...TEAM_PAGE_SETTINGS,
  ...NEWSLETTER_PAGE_SETTINGS,
} as const;

export type PagesInterface = HOME_PAGE_SETTINGS_TYPES &
  SERVICES_PAGE_SETTINGS_TYPES &
  ABOUT_PAGE_SETTINGS_TYPES &
  TEAM_PAGE_SETTINGS_TYPES &
  NEWSLETTER_PAGE_SETTINGS_TYPES;

export type PublicPageKeys = {
  [K in keyof typeof PAGE_SETTINGS_GUIDE]: (typeof PAGE_SETTINGS_GUIDE)[K]["visibility"] extends "public"
    ? K
    : never;
}[keyof typeof PAGE_SETTINGS_GUIDE];

export type PrivatePageKeys = {
  [K in keyof typeof PAGE_SETTINGS_GUIDE]: (typeof PAGE_SETTINGS_GUIDE)[K]["visibility"] extends "private"
    ? K
    : never;
}[keyof typeof PAGE_SETTINGS_GUIDE];

export type ValidPageSettingKey =
  | keyof HOME_PAGE_SETTINGS_TYPES
  | keyof SERVICES_PAGE_SETTINGS_TYPES
  | keyof ABOUT_PAGE_SETTINGS_TYPES
  | keyof TEAM_PAGE_SETTINGS_TYPES
  | keyof NEWSLETTER_PAGE_SETTINGS_TYPES;

export const pageGroupedKeys = {
  HomePage: Object.values(HOME_PAGE_SETTINGS_KEYS),
  AboutPage: Object.values(ABOUT_PAGE_SETTINGS_KEYS),
  ServicesPage: Object.values(SERVICES_PAGE_SETTINGS_KEYS),
  TeamPage: Object.values(TEAM_PAGE_SETTINGS_KEYS),
  NewsletterPage: Object.values(NEWSLETTER_PAGE_SETTINGS_KEYS),
};

export const pageTabLabels: Record<string, string> = {
  HomePage: "Home Page",
  AboutPage: "About Page",
  ServicesPage: "Services Page",
  TeamPage: "Team Page",
  NewsletterPage: "Newsletter Page",
};
