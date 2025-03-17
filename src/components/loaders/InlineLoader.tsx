import React from "react";
import { Spin, Empty, Alert } from "antd";

interface InlineLoaderProps {
  loading: boolean;
  error?: string | null;
  data: any[];
  emptyMessage?: string;
  loadingMessage?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
  loading,
  error = null,
  data,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
}) => {
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          flexDirection: "column",
        }}
      >
        <Spin size="small" />
        <div style={{ marginTop: "10px", color: "#555" }}>{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Empty description={emptyMessage} />
      </div>
    );
  }

  return null;
};

export default InlineLoader;
