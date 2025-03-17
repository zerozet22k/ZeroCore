"use client";
import React, { useState, useEffect } from "react";
import { InputNumber, Select, Space } from "antd";
import {
  defaultWrapperStyle,
  defaultInputStyle,
  defaultSelectStyle,
} from "../../InputStyle";

interface TextSizeInputProps {
  value?: string;
  onChange?: (size: string) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

const unitOptions = ["px", "em", "rem", "%", "vh", "vw"];

const SizeInput: React.FC<TextSizeInputProps> = ({
  value = "1em",
  onChange,
  style = {},
  inputStyle = {},
}) => {
  const [size, setSize] = useState<number>(parseFloat(value) || 1);
  const [unit, setUnit] = useState<string>(
    unitOptions.includes(value.replace(/[0-9.]/g, ""))
      ? value.replace(/[0-9.]/g, "")
      : "em"
  );

  useEffect(() => {
    onChange?.(`${size}${unit}`);
  }, [size, unit]);

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Space>
        <InputNumber
          min={0}
          step={0.1}
          value={size}
          onChange={(val) => setSize(val ?? 0)}
          style={{ width: 100, ...defaultInputStyle, ...inputStyle }}
        />
        <Select
          value={unit}
          onChange={(val) => setUnit(val)}
          style={{ width: 80, ...defaultSelectStyle }}
        >
          {unitOptions.map((unit) => (
            <Select.Option key={unit} value={unit}>
              {unit}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </div>
  );
};

export default SizeInput;
