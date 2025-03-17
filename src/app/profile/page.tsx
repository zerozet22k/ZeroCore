"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Descriptions, Alert } from "antd";
import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
import { useRouter } from "next/navigation";
import SubLoader from "@/components/loaders/SubLoader";
import { useUser } from "@/hooks/useUser";

const UserProfile: React.FC = () => {
  const { user, refreshUser, initialLoading } = useUser();
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!user && !initialLoading) {
      router.push("/login?redirect=/profile");
    }
  }, [user, initialLoading, router]);

  if (initialLoading) {
    return <SubLoader tip="Loading user profile..." />;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <Alert
          message="User Not Found"
          description="No user data available."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Card
        title="User Profile"
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Edit Profile
          </Button>
        }
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Roles">
            {user.roles?.length
              ? user.roles.map((role) => role.name).join(", ")
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ProfileUpdateForm
        user={user}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={refreshUser}
      />
    </div>
  );
};

export default UserProfile;
