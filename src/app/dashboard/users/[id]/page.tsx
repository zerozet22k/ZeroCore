"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserAPI } from "@/models/UserModel";
import { Result, Button, Card } from "antd";
import UserForm from "@/components/forms/UserForm";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";

const EditUserPage: React.FC = () => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.get(`/users/${userId}`);
          if (response.status === 200) {
            setUser(response.data);
          } else {
            setError("Failed to fetch user details.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError("An error occurred while fetching user details.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setError("Invalid user ID.");
      setLoading(false);
    }
  }, [userId]);

  return (
    <>
      {loading ? (
        <SubLoader tip="Loading user details..." />
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="error"
              title="Error"
              subTitle={error}
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/users")}
                >
                  Back to Users
                </Button>
              }
            />
          </Card>
        </div>
      ) : user ? (
        <UserForm user={user} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="warning"
              title="No User Found"
              subTitle="The user does not exist or has been removed."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/users")}
                >
                  Back to Users
                </Button>
              }
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default EditUserPage;
