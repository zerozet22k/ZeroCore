"use client";
import React from "react";
import { Typography, Tooltip } from "antd";

type FieldTitleProps = {
  label?: string | null;
  guide?: string | null;
  style?: React.CSSProperties;
  level?: 3 | 5 | 1 | 2 | 4 | undefined;
};

const FieldTitle: React.FC<FieldTitleProps> = ({
  label,
  guide,
  style = {},
  level = 4,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", ...style }}>
      {label && (
        <Typography.Title
          level={level}
          style={{ fontWeight: 500, marginTop: 0 }}
        >
          {label}
        </Typography.Title>
      )}
      {guide && (
        <Tooltip title={guide}>
          <Typography.Text
            style={{
              marginLeft: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ℹ️
          </Typography.Text>
        </Tooltip>
      )}
    </div>
  );
};

export default FieldTitle;
