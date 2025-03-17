"use client";

import React, { FC } from "react";
import { Spin } from "antd";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message = "" }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" />
      {message && (
        <div
          style={{
            marginTop: "16px",
            fontSize: "18px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
