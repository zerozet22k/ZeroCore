"use client";
import React from "react";
import { Button, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type ArrayChildCardDesignProps = {
  label: string;
  children: React.ReactNode;
  onRemove: (index: number) => void;
  index: number;
  style?: React.CSSProperties;
};

const ArrayChildCardDesign: React.FC<ArrayChildCardDesignProps> = ({
  label,
  children,
  onRemove,
  index,
  style = {},
}) => {
  return (
    <Card
      title={label}
      extra={
        <Button
          type="primary"
          danger
          icon={<CloseOutlined />}
          onClick={() => onRemove(index)}
        />
      }
      style={{
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        ...style,
      }}
    >
      {children}
    </Card>
  );
};

export default ArrayChildCardDesign;
