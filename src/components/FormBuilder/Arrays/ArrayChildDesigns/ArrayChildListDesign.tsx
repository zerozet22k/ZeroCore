"use client";
import React from "react";
import { Button, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type ArrayChildListDesignProps = {
  label: string;
  children: React.ReactNode;
  onRemove: (index: number) => void;
  index: number;
  style?: React.CSSProperties;
};

const ArrayChildListDesign: React.FC<ArrayChildListDesignProps> = ({
  label,
  children,
  onRemove,
  index,
  style = {},
}) => {
  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        border: "2px dashed #d9d9d9",
        borderRadius: "10px",
        backgroundColor: "#fafafa",
        ...style,
      }}
    >
      <Typography.Title level={5}>{label}</Typography.Title>
      {children}
      <Button
        type="primary"
        danger
        icon={<CloseOutlined />}
        onClick={() => onRemove(index)}
        style={{ width: "100%", marginTop: "12px" }}
      >
        Remove Item
      </Button>
    </div>
  );
};

export default ArrayChildListDesign;
