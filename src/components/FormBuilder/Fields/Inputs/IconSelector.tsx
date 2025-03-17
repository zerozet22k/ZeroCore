"use client";
import React, { CSSProperties } from "react";
import { Select } from "antd";
import { DynamicIcon, IconKeys } from "@/config/navigations/IconMapper";
import { defaultWrapperStyle, defaultSelectStyle } from "../../InputStyle";

interface IconSelectorProps {
  value?: string;
  onChange?: (iconName: string) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  style = {},
  inputStyle = {},
}) => {
  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Select
        showSearch
        placeholder="Select an icon"
        value={value}
        onChange={onChange}
        filterOption={(input, option) =>
          (String(option?.value) ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        optionLabelProp="label"
        style={{ ...defaultSelectStyle, ...inputStyle }}
      >
        {IconKeys.map((icon) => (
          <Select.Option
            key={icon}
            value={icon}
            label={
              <span style={{ display: "flex", alignItems: "center" }}>
                <DynamicIcon name={icon} />
                <span style={{ marginLeft: "8px" }}>{icon}</span>
              </span>
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 8px",
              }}
            >
              <DynamicIcon name={icon} />
              <span style={{ marginLeft: "8px" }}>{icon}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default IconSelector;
