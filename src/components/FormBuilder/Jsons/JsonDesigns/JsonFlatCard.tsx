"use client";
import React from "react";
import { theme } from "antd";
import FieldTitle from "../../Fields/extra/FieldTitle";

type FlatCardProps = {
  label?: string | null;
  guide?: string | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
};

const JsonFlatCard: React.FC<FlatCardProps> = ({
  label,
  guide,
  children,
  extra,
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
        backgroundColor: token.colorBgContainer,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style,
      }}
    >
      {(label || extra) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FieldTitle label={label} guide={guide} />
          {extra && <div>{extra}</div>}
        </div>
      )}

      {children}
    </div>
  );
};

export default JsonFlatCard;
