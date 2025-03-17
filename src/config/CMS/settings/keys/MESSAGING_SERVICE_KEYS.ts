import { FormType, GeneralConfig, NestedFieldType } from "..";

export const MESSAGING_SERVICE_SETTINGS_KEYS = {
  TELEGRAM: "telegram",
  VIBER: "viber",
} as const;

export const MESSAGING_SERVICE_SETTINGS: GeneralConfig<
  typeof MESSAGING_SERVICE_SETTINGS_KEYS
> = {
  [MESSAGING_SERVICE_SETTINGS_KEYS.TELEGRAM]: {
    label: "Telegram Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      botToken: {
        label: "Telegram Bot Token",
        guide: "Enter your Telegram bot token.",
        formType: FormType.TEXT,
      },
      chatId: {
        label: "Telegram Chat ID",
        guide: "Enter your Telegram chat ID.",
        formType: FormType.TEXT,
      },
    },
  },
  [MESSAGING_SERVICE_SETTINGS_KEYS.VIBER]: {
    label: "Viber Settings",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      botToken: {
        label: "Viber Bot Token",
        guide: "Enter your Viber bot token.",
        formType: FormType.TEXT,
      },
    },
  },
};

export type MESSAGING_SERVICE_TYPES = {
  [MESSAGING_SERVICE_SETTINGS_KEYS.TELEGRAM]: {
    botToken: string;
    chatId: string;
  };
  [MESSAGING_SERVICE_SETTINGS_KEYS.VIBER]: {
    botToken: string;
  };
};
