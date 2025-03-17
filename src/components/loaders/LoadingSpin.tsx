"use client";

import React, { FC } from "react";
import { Spin, theme } from "antd";

interface LoadingSpinProps {
  message?: string;
}

const LoadingSpin: FC<LoadingSpinProps> = ({ message = "" }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: colorBgContainer,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpin;
