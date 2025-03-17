import React from "react";
import { Spin } from "antd";

interface SubLoaderProps {
  tip?: string;
  minHeight?: string | number;
  backgroundColor?: string;
}

const SubLoader: React.FC<SubLoaderProps> = ({
  tip = "Loading...",
  minHeight = "100vh",
  backgroundColor = "transparent",
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: minHeight,
        backgroundColor: backgroundColor,
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default SubLoader;
