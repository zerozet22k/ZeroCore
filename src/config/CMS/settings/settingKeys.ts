import {
  GLOBAL_SETTINGS_KEYS,
  GLOBAL_SETTINGS,
  GLOBAL_SETTINGS_TYPES,
} from "./keys/GLOBAL_SETTINGS_KEYS";

import {
  MAIL_SETTINGS_KEYS,
  MAIL_SETTINGS,
  MAIL_SETTINGS_TYPES,
} from "./keys/MAIL_KEYS";

import {
  FIREBASE_SETTINGS_KEYS,
  FIREBASE_SETTINGS,
  FIREBASE_SETTINGS_TYPES,
} from "./keys/FIREBASE_SETTINGS_KEYS";

import {
  SOCIAL_MEDIA_SETTINGS_KEYS,
  SOCIAL_MEDIA_SETTINGS,
  SOCIAL_MEDIA_SETTINGS_TYPES,
} from "./keys/SOCIAL_MEDIA_KEYS";

import {
  MESSAGING_SERVICE_SETTINGS_KEYS,
  MESSAGING_SERVICE_SETTINGS,
  MESSAGING_SERVICE_TYPES,
} from "./keys/MESSAGING_SERVICE_KEYS";

import {
  DESIGN_SCHEMA_SETTINGS_KEYS,
  DESIGN_SCHEMA_SETTINGS,
  DESIGN_SCHEMA_SETTINGS_TYPES,
} from "./keys/DESIGN_SCHEMA_KEYS";

import {
  SEO_SETTINGS_KEYS,
  SEO_SETTINGS,
  SEO_SETTINGS_TYPES,
} from "./keys/SEO_SETTINGS_KEYS";

import {
  LANGUAGE_SETTINGS_KEYS,
  LANGUAGE_SETTINGS,
  LANGUAGE_SETTINGS_TYPES,
} from "./keys/LANGUAGE_SETTINGS_KEYS";

import {
  PUSHER_SETTINGS_KEYS,
  PUSHER_SETTINGS,
  PUSHER_SETTINGS_TYPES,
} from "./keys/PUSHER_SETTINGS_KEYS";

export const SETTINGS_KEYS = {
  ...GLOBAL_SETTINGS_KEYS,
  ...MAIL_SETTINGS_KEYS,
  ...FIREBASE_SETTINGS_KEYS,
  ...SOCIAL_MEDIA_SETTINGS_KEYS,
  ...MESSAGING_SERVICE_SETTINGS_KEYS,
  ...DESIGN_SCHEMA_SETTINGS_KEYS,
  ...SEO_SETTINGS_KEYS,
  ...LANGUAGE_SETTINGS_KEYS,
  ...PUSHER_SETTINGS_KEYS,
} as const;

export const SETTINGS_GUIDE = {
  ...GLOBAL_SETTINGS,
  ...MAIL_SETTINGS,
  ...FIREBASE_SETTINGS,
  ...SOCIAL_MEDIA_SETTINGS,
  ...MESSAGING_SERVICE_SETTINGS,
  ...DESIGN_SCHEMA_SETTINGS,
  ...SEO_SETTINGS,
  ...LANGUAGE_SETTINGS,
  ...PUSHER_SETTINGS,
} as const;

export type SettingsInterface = GLOBAL_SETTINGS_TYPES &
  MAIL_SETTINGS_TYPES &
  FIREBASE_SETTINGS_TYPES &
  SOCIAL_MEDIA_SETTINGS_TYPES &
  MESSAGING_SERVICE_TYPES &
  DESIGN_SCHEMA_SETTINGS_TYPES &
  SEO_SETTINGS_TYPES &
  LANGUAGE_SETTINGS_TYPES &
  PUSHER_SETTINGS_TYPES;

export type PublicKeys = {
  [K in keyof typeof SETTINGS_GUIDE]: (typeof SETTINGS_GUIDE)[K]["visibility"] extends "public"
    ? K
    : never;
}[keyof typeof SETTINGS_GUIDE];

export type PrivateKeys = {
  [K in keyof typeof SETTINGS_GUIDE]: (typeof SETTINGS_GUIDE)[K]["visibility"] extends "private"
    ? K
    : never;
}[keyof typeof SETTINGS_GUIDE];

export type ValidSettingKey =
  | keyof GLOBAL_SETTINGS_TYPES
  | keyof MAIL_SETTINGS_TYPES
  | keyof FIREBASE_SETTINGS_TYPES
  | keyof SOCIAL_MEDIA_SETTINGS_TYPES
  | keyof MESSAGING_SERVICE_TYPES
  | keyof DESIGN_SCHEMA_SETTINGS_TYPES
  | keyof SEO_SETTINGS_TYPES
  | keyof LANGUAGE_SETTINGS_TYPES
  | keyof PUSHER_SETTINGS_TYPES;

export const settingGroupedKeys = {
  Global: Object.values(GLOBAL_SETTINGS_KEYS),
  SEO: Object.values(SEO_SETTINGS_KEYS),
  Mail: Object.values(MAIL_SETTINGS_KEYS),
  Firebase: Object.values(FIREBASE_SETTINGS_KEYS),
  SocialMedia: Object.values(SOCIAL_MEDIA_SETTINGS_KEYS),
  MessagingService: Object.values(MESSAGING_SERVICE_SETTINGS_KEYS),
  DesignSchema: Object.values(DESIGN_SCHEMA_SETTINGS_KEYS),
  Language: Object.values(LANGUAGE_SETTINGS_KEYS),
  Pusher: Object.values(PUSHER_SETTINGS_KEYS),
};

export const settingTabLabels: Record<string, string> = {
  Global: "Site Settings",
  SEO: "SEO Settings",
  Mail: "Mail",
  Firebase: "Firebase Storage",
  Payment: "Payment Settings",
  SocialMedia: "Social Media",
  MessagingService: "Messaging Service",
  DesignSchema: "App Design",
  Language: "Supported Languages",
  Pusher: "Real-time Messaging",
};
