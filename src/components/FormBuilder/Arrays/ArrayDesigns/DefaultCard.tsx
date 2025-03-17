"use client";
import React, { CSSProperties } from "react";
import { Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type DefaultCardProps = {
  label: string;
  children: React.ReactNode;
  onAdd: () => void;
  showAddButton?: boolean;
  style?: CSSProperties;
};

const DefaultCard: React.FC<DefaultCardProps> = ({
  label,
  children,
  onAdd,
  showAddButton = true,
  style = {},
}) => {
  return (
    <Card
      title={label}
      extra={
        showAddButton && (
          <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
            Add New Block
          </Button>
        )
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

export default DefaultCard;
