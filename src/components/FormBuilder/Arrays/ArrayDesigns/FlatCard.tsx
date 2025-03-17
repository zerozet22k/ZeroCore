"use client";
import React, { CSSProperties } from "react";
import { Button, Typography, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { lighten } from "polished";

type FlatCardProps = {
  label: string;
  children: React.ReactNode;
  onAdd: () => void;
  showAddButton?: boolean;
  style?: CSSProperties;
};

const FlatCard: React.FC<FlatCardProps> = ({
  label,
  children,
  onAdd,
  showAddButton = true,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        border: `2px dashed ${token.colorBorder}`,
        borderRadius: "10px",
        backgroundColor: lighten(0.05, token.colorBgContainer),
        ...style,
      }}
    >
      <Typography.Title level={5} style={{ marginBottom: 8 }}>
        {label}
      </Typography.Title>

      {showAddButton && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ width: "100%", marginBottom: "12px" }}
        >
          Add New Block
        </Button>
      )}

      {children}
    </div>
  );
};

export default FlatCard;
