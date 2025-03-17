import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  FieldDesign,
  JsonFunctionality,
} from "..";

export const PUSHER_SETTINGS_KEYS = {
  PUSHER: "pusher",
} as const;

export const PUSHER_SETTINGS: GeneralConfig<typeof PUSHER_SETTINGS_KEYS> = {
  [PUSHER_SETTINGS_KEYS.PUSHER]: {
    label: "Pusher Settings",
    type: NestedFieldType.JSON,
    jsonFunctionalities: [JsonFunctionality.INTELLIGENT],
    visibility: "private",
    design: JsonDesign.PARENT,
    fields: {
      app_id: {
        label: "Pusher App ID",
        guide: "Your Pusher application ID.",
        formType: FormType.TEXT,
      },

      key: {
        label: "Pusher Key",
        guide: "Your Pusher application key.",
        formType: FormType.TEXT,
      },
      secret: {
        label: "Pusher Secret",
        guide: "Your Pusher application secret.",
        formType: FormType.TEXT,
      },
      cluster: {
        label: "Pusher Cluster",
        guide: "Your Pusher application cluster.",
        formType: FormType.TEXT,
      },
    },
  },
};

export type PUSHER_SETTINGS_TYPES = {
  [PUSHER_SETTINGS_KEYS.PUSHER]: {
    app_id: string;
    key: string;
    secret: string;
    cluster: string;
  };
};
