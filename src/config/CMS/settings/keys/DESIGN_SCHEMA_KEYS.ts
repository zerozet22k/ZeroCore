  import { FormType, GeneralConfig, NestedFieldType } from "..";

  export const DESIGN_SCHEMA_SETTINGS_KEYS = {
    THEME: "theme",
  } as const;

  export const DESIGN_SCHEMA_SETTINGS: GeneralConfig<
    typeof DESIGN_SCHEMA_SETTINGS_KEYS
  > = {
    [DESIGN_SCHEMA_SETTINGS_KEYS.THEME]: {
      label: "Theme",
      type: NestedFieldType.JSON,
      visibility: "public",
      fields: {
        themeMode: {
          label: "Theme Mode",
          guide: "Select a theme mode for your site.",
          formType: FormType.SELECT,
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Compact Light", value: "compact-light" },
          ],
        },
      },
    },
  };

  export type ThemeSchema = {
    themeMode: "light" | "dark" | "compact-light";
  };

  export type DESIGN_SCHEMA_SETTINGS_TYPES = {
    [DESIGN_SCHEMA_SETTINGS_KEYS.THEME]: ThemeSchema;
  };

  export const defaultThemeSchema: ThemeSchema = {
    themeMode: "light",
  };
