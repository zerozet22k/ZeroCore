"use client";
import React from "react";
import { Card } from "antd";
import FieldTitle from "../extra/FieldTitle";

type FieldDefaultCardProps = {
  label?: string | null;
  guide?: string | null;
  extra?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const FieldDefaultCard: React.FC<FieldDefaultCardProps> = ({
  label,
  guide,
  extra,
  children,
  style = {},
}) => {
  return (
    <Card
      title={<FieldTitle label={label} guide={guide} level={5} />}
      extra={extra}
      style={{
        padding: "10px",
        marginBottom: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        ...style,
      }}
    >
      row
      {label}
      {children}
    </Card>
  );
};

export default FieldDefaultCard;
