"use client";
import React from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type ArrayChildNoneDesignProps = {
  children: React.ReactNode;
  onRemove: (index: number) => void;
  index: number;
  style?: React.CSSProperties;
};

const ArrayChildNoneDesign: React.FC<ArrayChildNoneDesignProps> = ({
  children,
  onRemove,
  index,
  style = {},
}) => {
  return (
    <div style={style}>
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

export default ArrayChildNoneDesign;
