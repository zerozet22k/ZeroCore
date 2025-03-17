export enum FormType {
  TEXT = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
  URL = "url",
  FILE = "file",
  SELECT = "select",
  EMAIL = "email",
  COLOR = "color",
  TEXTAREA = "textarea",
  CUSTOM_FILE = "custom-file",
  IMAGE_SELECTOR = "image-selector",
  ICON_SELECTOR = "icon-selector",
  ROLE_SELECTOR = "role-selector",
  SUPPORTED_LANGUAGE_SELECTOR = "supported-language-selector",
  LANGUAGE_JSON_TEXT = "language-json-text",
  LANGUAGE_JSON_TEXTAREA = "language-json-textarea",
  RESPONSIVE_IMAGES = "responsive-images",
  SIZE = "size",
}
export type ResponsiveImagesType = {
  desktop?: string;
  tablet?: string;
  mobile?: string;
};

export enum NestedFieldType {
  JSON = "json",
  ARRAY = "array",
}
export enum TextAlign {
  LEFT = "left",
  RIGHT = "right",
}
export enum ModalBehaviorType {
  OPEN_IN_MODAL = "openInModal",
  ITEM_MODAL = "itemModal",
}

export type ModalBehavior = {
  [ModalBehaviorType.OPEN_IN_MODAL]?: boolean;
  [ModalBehaviorType.ITEM_MODAL]?: boolean;
};

export enum JsonDesign {
  FLAT = "flat",
  FLAT_OUTSIDE = "flat_outside",
  CARD = "card",
  PARENT = "parent",
  NONE = "none",
}

export enum ArrayDesign {
  FLAT = "flat",
  FLAT_OUTSIDE = "flat_outside",
  CARD = "card",
  PARENT = "parent",
  NONE = "none",
}

export enum ChildArrayDesign {
  LIST = "list",
  CARD = "card",
  TABLE = "table",
  NONE = "none",
}

export enum JsonFunctionality {
  INTELLIGENT = "intelligent",
}

export enum ArrayFunctionality {
  SORTABLE = "sortable",
  FILTERABLE = "filterable",
  DRAGGABLE = "draggable",
}

export enum FieldDesign {
  NONE = "none",
  CARD = "card",
  PARENT = "parent",
  ROW = "row",
}

interface BaseParentField {
  label?: string;
  guide?: string;
  visibility?: "public" | "private";
}

interface BaseChildField {
  label?: string;
  guide?: string;
}

export interface FieldInfo extends BaseParentField {
  formType: FormType;
  parentDesign?: FieldDesign;
}

export interface NestedJsonField extends BaseParentField {
  design?: JsonDesign;
  modalBehavior?: ModalBehavior;
  type: NestedFieldType.JSON;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  jsonFunctionalities?: JsonFunctionality[];
}

export interface NestedArrayField extends BaseParentField {
  modalBehavior?: ModalBehavior;
  type: NestedFieldType.ARRAY;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  keyLabel?: string;
  arrayDesign?: ArrayDesign;
  childArrayDesign?: ChildArrayDesign;
  arrayFunctionalities?: ArrayFunctionality[];
}

export interface ChildFieldInfo extends BaseChildField {
  formType: FormType;
  parentDesign?: FieldDesign;
  options?: { label: string; value: string | number }[];
}

export interface ChildNestedJsonField extends BaseChildField {
  visibility?: "public" | "private";
  design?: JsonDesign;
  modalBehavior?: ModalBehavior;

  type: NestedFieldType.JSON;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  jsonFunctionalities?: JsonFunctionality[];
}

export interface ChildNestedArrayField extends BaseChildField {
  visibility?: "public" | "private";
  modalBehavior?: ModalBehavior;

  type: NestedFieldType.ARRAY;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  keyLabel?: string;
  arrayDesign?: ArrayDesign;
  childArrayDesign?: ChildArrayDesign;
  arrayFunctionalities?: ArrayFunctionality[];
}

export type GeneralConfig<Keys extends Record<string, string>> = {
  [K in Keys[keyof Keys]]: FieldInfo | NestedJsonField | NestedArrayField;
};

type ValidValue = string | number | boolean | object | null | undefined;

export function mergeJsonByConfig(
  currentValue: Record<string, any> | undefined,
  newObj: Record<string, any>,
  config: {
    fields: Record<
      string,
      ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
    >;
  }
): Record<string, any> {
  const merged: Record<string, ValidValue> = currentValue
    ? { ...currentValue }
    : {};

  for (const [fieldKey, fieldConfig] of Object.entries(config.fields)) {
    if (!(fieldKey in newObj)) {
      continue;
    }

    const pastedValue = newObj[fieldKey];

    if (
      "type" in fieldConfig &&
      fieldConfig.type === NestedFieldType.JSON &&
      typeof pastedValue === "object" &&
      pastedValue !== null
    ) {
      merged[fieldKey] = mergeJsonByConfig(
        currentValue?.[fieldKey],
        pastedValue,
        fieldConfig
      );
    } else if (
      "type" in fieldConfig &&
      fieldConfig.type === NestedFieldType.ARRAY &&
      Array.isArray(pastedValue)
    ) {
      merged[fieldKey] = pastedValue;
    } else {
      merged[fieldKey] = pastedValue;
    }
  }

  return merged;
}
