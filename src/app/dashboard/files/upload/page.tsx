"use client";

import React from "react";
import { Card, Typography } from "antd";
import FileUploader from "@/components/FileUploader/FileUploader";

const { Title } = Typography;

export default function FileUploadPage() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "20px" }}>
      <Card
        title={<Title level={3}>File Upload Page</Title>}
        bordered={false}
        style={{
          borderRadius: 10,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: 20,
        }}
      >
        <FileUploader />
      </Card>
    </div>
  );
}
