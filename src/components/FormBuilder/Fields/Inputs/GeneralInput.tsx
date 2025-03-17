import React, { CSSProperties } from "react";
import { Input, Switch, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormType } from "@/config/CMS/settings";
import {
  defaultWrapperStyle,
  defaultInputStyle,
  defaultSelectStyle,
} from "../../InputStyle";

type GeneralInputProps = {
  formType: FormType;
  value: any;
  onChange: (value: any) => void;
  options?: { label: string; value: string | number }[];
  style?: CSSProperties;
};

const GeneralInput: React.FC<GeneralInputProps> = ({
  formType,
  value,
  onChange,
  options = [],
  style = {},
}) => {
  switch (formType) {
    case FormType.COLOR:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            style={{
              ...defaultInputStyle,
              width: "50px",
              height: "36px",
              cursor: "pointer",
            }}
          />
          <span>{value || "#000000"}</span>
        </div>
      );

    case FormType.BOOLEAN:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Switch checked={!!value} onChange={onChange} />
          <span style={{marginLeft: '10px'}}>{value ? "Enabled" : "Disabled"}</span>
        </div>
      );

    case FormType.FILE:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Upload
            beforeUpload={(file) => {
              onChange(file);
              return false;
            }}
            showUploadList={false}
          >
            <Input
              addonBefore={<UploadOutlined />}
              placeholder={value ? value.name : "Upload a file"}
              readOnly
              style={defaultInputStyle}
            />
          </Upload>
        </div>
      );

    case FormType.SELECT:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Select
            value={value || ""}
            onChange={onChange}
            style={{ ...defaultSelectStyle }}
            placeholder="Select an option"
          >
            {options.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      );

    case FormType.TEXTAREA:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Input.TextArea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            style={defaultInputStyle}
          />
        </div>
      );

    default:
      return (
        <div style={{ ...defaultWrapperStyle, ...style }}>
          <Input
            type={
              formType === FormType.NUMBER
                ? "number"
                : formType === FormType.EMAIL
                ? "email"
                : formType === FormType.URL
                ? "url"
                : "text"
            }
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={defaultInputStyle}
          />
        </div>
      );
  }
};

export default GeneralInput;
