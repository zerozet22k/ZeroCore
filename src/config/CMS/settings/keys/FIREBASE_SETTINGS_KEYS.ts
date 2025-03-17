import {
  FormType,
  GeneralConfig,
  NestedFieldType,
  JsonDesign,
  JsonFunctionality,
  FieldDesign,
} from "..";

export const FIREBASE_SETTINGS_KEYS = {
  FIREBASE: "firebase",
} as const;

export const FIREBASE_SETTINGS: GeneralConfig<typeof FIREBASE_SETTINGS_KEYS> = {
  [FIREBASE_SETTINGS_KEYS.FIREBASE]: {
    label: "Firebase Settings",
    type: NestedFieldType.JSON,
    visibility: "private",
    design: JsonDesign.NONE,
    fields: {
      bucket: {
        label: "Firebase Storage Bucket",
        guide: "This is the Firebase storage bucket name.",
        formType: FormType.TEXT,
        parentDesign: FieldDesign.PARENT,
      },
      serviceAccount: {
        label: "Firebase Admin Service Account",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        jsonFunctionalities: [JsonFunctionality.INTELLIGENT],
        fields: {
          type: {
            label: "Service Account Type",
            guide: "This is always 'service_account'.",
            formType: FormType.TEXT,
          },
          project_id: {
            label: "Project ID",
            guide: "Your Firebase project ID.",
            formType: FormType.TEXT,
          },
          private_key_id: {
            label: "Private Key ID",
            guide: "The unique ID for the private key.",
            formType: FormType.TEXT,
          },
          private_key: {
            label: "Private Key",
            guide: "The private key used for authentication.",
            formType: FormType.TEXTAREA,
          },
          client_email: {
            label: "Client Email",
            guide: "The service account email address.",
            formType: FormType.EMAIL,
          },
          client_id: {
            label: "Client ID",
            guide: "The unique client ID.",
            formType: FormType.TEXT,
          },
          auth_uri: {
            label: "Auth URI",
            guide: "OAuth 2.0 authentication endpoint.",
            formType: FormType.URL,
          },
          token_uri: {
            label: "Token URI",
            guide: "OAuth 2.0 token endpoint.",
            formType: FormType.URL,
          },
          auth_provider_x509_cert_url: {
            label: "Auth Provider X509 URL",
            guide: "Google OAuth2 certificate URL.",
            formType: FormType.URL,
          },
          client_x509_cert_url: {
            label: "Client X509 Cert URL",
            guide: "Client-specific certificate URL.",
            formType: FormType.URL,
          },
          universe_domain: {
            label: "Universe Domain",
            guide: "Universe Domain.",
            formType: FormType.URL,
          },
        },
      },
    },
  },
};

export type FIREBASE_SETTINGS_TYPES = {
  [FIREBASE_SETTINGS_KEYS.FIREBASE]: {
    bucket: string;
    serviceAccount: {
      type: string;
      project_id: string;
      private_key_id: string;
      private_key: string;
      client_email: string;
      client_id: string;
      auth_uri: string;
      token_uri: string;
      auth_provider_x509_cert_url: string;
      client_x509_cert_url: string;
      universe_domain: string;
    };
  };
};
