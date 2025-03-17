"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, message, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import apiClient from "@/utils/api/apiClient";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

const CreateInquiryPage: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const canPostInquiry = user
    ? hasPermission(user, [APP_PERMISSIONS.POST_INQUIRY])
    : false;

  useEffect(() => {
    if (!userLoading && (!user || !canPostInquiry)) {
      message.error("You do not have permission to create an inquiry.");
      router.push("/");
    }
  }, [user, userLoading, canPostInquiry, router]);

  const handleCreateInquiry = async () => {
    if (!text.trim()) return message.warning("Question cannot be empty.");

    setLoading(true);
    try {
      const response = await apiClient.post("/inquiry", { text });

      if (response.status === 201) {
        message.success("Inquiry posted successfully!");
        router.push("/inquiry");
      } else {
        message.error("Failed to post inquiry.");
      }
    } catch (error) {
      console.error("Error creating inquiry:", error);
      message.error("An error occurred.");
    }
    setLoading(false);
  };

  if (userLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        marginTop: "80px",
      }}
    >
      <Card style={{ padding: "20px", width: "100%", maxWidth: "600px" }}>
        <h2 style={{ textAlign: "center" }}>Ask a Question</h2>

        <Input.TextArea
          placeholder="What do you want to ask?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ marginTop: "10px" }}
        />

        <Button
          type="primary"
          icon={loading ? <Spin /> : <SendOutlined />}
          onClick={handleCreateInquiry}
          disabled={loading}
          style={{ marginTop: "15px", width: "100%" }}
        >
          Post Inquiry
        </Button>
      </Card>
    </div>
  );
};

export default CreateInquiryPage;
