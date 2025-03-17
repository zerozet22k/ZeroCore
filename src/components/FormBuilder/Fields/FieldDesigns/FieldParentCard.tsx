"use client";
import React from "react";
import { Card, theme } from "antd";
import { darken } from "polished";
import FieldTitle from "../extra/FieldTitle";

type FieldParentCardProps = {
  label?: string | null;
  guide?: string | null;
  extra?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const FieldParentCard: React.FC<FieldParentCardProps> = ({
  label,
  guide,
  extra,
  children,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <Card
      title={<FieldTitle label={label} guide={guide} level={5} />}
      extra={extra}
      style={{
        padding: "10px",
        marginBottom: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        borderLeft: `4px solid ${token.colorPrimary}`,
        ...style,
      }}
    >
    
      {children}
    </Card>
  );
};

export default FieldParentCard;
