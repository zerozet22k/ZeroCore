"use client";
import React from "react";
import { Typography, theme } from "antd";
import FieldTitle from "../../Fields/extra/FieldTitle";

type FlatOutsideCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
};

const JsonFlatOutsideCard: React.FC<FlatOutsideCardProps> = ({
  label,
  guide,
  children,
  extra,
  style = {},
}) => {
  const { token } = theme.useToken();

  return (
    <div style={{ marginBottom: "16px" }}>
      {(label || extra) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {label && <FieldTitle label={label} guide={guide} />}
          {extra && <div>{extra}</div>}
        </div>
      )}

      <div
        style={{
          padding: "12px",
          border: `2px dashed ${token.colorBorder}`,
          borderRadius: "10px",
          backgroundColor: token.colorBgContainer,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default JsonFlatOutsideCard;
