"use client";
import React, { useMemo } from "react";
import { Card, Typography, Row, Col, Space } from "antd";
import { useUser } from "@/hooks/useUser";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useUser();

  const userDetails = useMemo(() => {
    if (!user) return <Text type="secondary">No user data available.</Text>;

    return (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space direction="horizontal" size="small">
          <Text strong>Email:</Text>
          <Text>{user.email || "N/A"}</Text>
        </Space>
        <Space direction="horizontal" size="small">
          <Text strong>Role:</Text>
          <Text style={{ textTransform: "capitalize" }}>
            {user.roles?.length
              ? user.roles.map((role) => role.name).join(", ")
              : "N/A"}
          </Text>
        </Space>
      </Space>
    );
  }, [user]);

  return (
    <div
      style={{
        padding: "40px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row justify="center" style={{ width: "100%" }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "24px" }}
            >
              Welcome to Your Dashboard
            </Title>
            {userDetails}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
