"use client";
import React, { CSSProperties } from "react";
import { Typography, Tooltip, theme } from "antd";
import { FieldDesign, ChildFieldInfo, FormType } from "@/config/CMS/settings";
import ImageSelector from "./Inputs/ImageSelector";
import RoleSelector from "./Inputs/RoleSelector";
import GeneralInput from "@/components/FormBuilder/Fields/Inputs/GeneralInput";
import IconSelector from "./Inputs/IconSelector";
import SupportedLanguageSelector from "./Inputs/SupportedLanguageSelector";
import LanguageJsonTextarea from "./Inputs/LanguageJsonTextarea";
import LanguageJsonTextInput from "./Inputs/LanguageJsonTextInput";
import FieldDesignRenderer from "./FieldDesignRenderer";
import FieldTitle from "./extra/FieldTitle";
import SizeInput from "./Inputs/SizeInput";
import ResponsiveImagesInput from "./Inputs/ResponsiveImagesInput";

type FieldRendererProps = {
  config: ChildFieldInfo;
  value: any;
  onChange: (value: any) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  zIndex?: number;
};

const renderFormField = (
  formType: FormType,
  value: any,
  onChange: (val: any) => void,
  options?: { label: string; value: string | number }[],
  inputStyle?: CSSProperties,
  zIndex?: number
) => {
  const commonStyle = { ...inputStyle };

  switch (formType) {
    case FormType.IMAGE_SELECTOR:
      return (
        <ImageSelector
          value={value || ""}
          onChange={onChange}
          style={commonStyle}
          zIndex={zIndex}
        />
      );

    case FormType.ROLE_SELECTOR:
      return (
        <RoleSelector value={value} onChange={onChange} style={commonStyle} />
      );

    case FormType.ICON_SELECTOR:
      return (
        <IconSelector value={value} onChange={onChange} style={commonStyle} />
      );

    case FormType.SUPPORTED_LANGUAGE_SELECTOR:
      return (
        <SupportedLanguageSelector
          value={value}
          onChange={onChange}
          style={commonStyle}
        />
      );

    case FormType.LANGUAGE_JSON_TEXT:
      return <LanguageJsonTextInput value={value || {}} onChange={onChange} />;

    case FormType.LANGUAGE_JSON_TEXTAREA:
      return <LanguageJsonTextarea value={value || {}} onChange={onChange} />;
    case FormType.SIZE:
      return (
        <SizeInput
          value={value || "1em"}
          onChange={onChange}
          style={commonStyle}
        />
      );
    case FormType.RESPONSIVE_IMAGES:
      return <ResponsiveImagesInput value={value} onChange={onChange} />;
    default:
      return (
        <GeneralInput
          formType={formType}
          value={value}
          onChange={onChange}
          options={options}
          style={commonStyle}
        />
      );
  }
};

const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  value,
  onChange,
  style = {},
  inputStyle = {},
  zIndex = 1000,
}) => {
  const parentDesign = config.parentDesign || FieldDesign.ROW;

  const content = renderFormField(
    config.formType,
    value,
    onChange,
    config.options,
    inputStyle,
    zIndex
  );

  return (
    <FieldDesignRenderer
      design={parentDesign}
      label={config.label}
      guide={config.guide}
      renderItem={() => content}
      style={style}
    />
  );
};

export default FieldRenderer;
