"use client";
import React from "react";
import { Card, theme } from "antd";
import { darken } from "polished";
import FieldTitle from "../../Fields/extra/FieldTitle";

type ParentCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
};

const JsonParentCard: React.FC<ParentCardProps> = ({
  label,
  guide,
  children,
  extra,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <Card
      title={<FieldTitle label={label} guide={guide} />}
      extra={extra}
      style={{
        borderRadius: "12px",
        padding: "16px",
        borderLeft: `4px solid ${token.colorPrimary}`,
        boxShadow: `0 4px 12px ${darken(0.1, token.colorBgContainer)}`,
        backgroundColor: token.colorBgContainer,
        marginBottom: "20px",
        ...style,
      }}
    >
      {children}
    </Card>
  );
};

export default JsonParentCard;
