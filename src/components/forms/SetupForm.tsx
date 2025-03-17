"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Alert,
  Typography,
  Spin,
  Modal,
  Card,
} from "antd";
import { useRouter } from "next/navigation";
import { SETTINGS_KEYS } from "@/config/CMS/settings/settingKeys";
import apiClient from "@/utils/api/apiClient";

const { Title, Text } = Typography;

const SetupForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    form
      .getFieldInstance(
        currentStep === 1
          ? "username"
          : `${SETTINGS_KEYS.SITE_SETTINGS}.siteName`
      )
      ?.focus();
  }, [currentStep, form]);

  const handleNextStep = async (values: any) => {
    setUserData({ ...userData, ...values });
    setCurrentStep(2);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);

    const payload = {
      user: userData,
      settings: {
        [SETTINGS_KEYS.SITE_SETTINGS]: {
          siteName: values[`${SETTINGS_KEYS.SITE_SETTINGS}.siteName`],
          siteUrl: values[`${SETTINGS_KEYS.SITE_SETTINGS}.siteUrl`],
        },
      },
    };

    Modal.confirm({
      title: "Confirm Setup",
      content: "Are you sure you want to save the settings?",
      centered: true,
      onOk: async () => {
        try {
          const response = await apiClient.post("/setup", payload);
          if (response.status === 201) {
            message.success("Setup completed successfully!");
            setSetupCompleted(true);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setError(
              response.data?.error || "Setup failed! Please check your details."
            );
          }
        } catch (error: any) {
          setError(
            error.response?.data?.error ||
              "An unexpected error occurred. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedUsername = e.target.value.toLowerCase().replace(/\s+/g, "");
    form.setFieldsValue({ username: formattedUsername });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Setup Your Site
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={currentStep === 1 ? handleNextStep : handleSubmit}
        >
          {currentStep === 1 ? (
            <>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  {
                    pattern: /^[a-z0-9]+$/,
                    message: "Username must be lowercase and contain no spaces",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your username"
                  onChange={handleUsernameChange}
                  size="large"
                  autoComplete="off" // Prevent autofill
                  spellCheck={false}
                  autoCorrect="off"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  size="large"
                  autoComplete="email" // Allow autofill for email
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  {loading ? <Spin /> : "Next"}
                </Button>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Site Name"
                name={`${SETTINGS_KEYS.SITE_SETTINGS}.siteName`}
                rules={[
                  { required: true, message: "Please input your site name!" },
                ]}
              >
                <Input placeholder="Enter your site name" size="large" />
              </Form.Item>

              <Form.Item
                label="Site URL"
                name={`${SETTINGS_KEYS.SITE_SETTINGS}.siteUrl`}
                rules={[
                  {
                    required: true,
                    type: "url",
                    message: "Please input a valid site URL!",
                  },
                ]}
              >
                <Input placeholder="Enter your site URL" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  {loading ? <Spin /> : "Save Settings"}
                </Button>
              </Form.Item>
            </>
          )}
        </Form>

        {setupCompleted && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="success" style={{ fontSize: "16px" }}>
              Setup completed!
            </Text>
            <br />
            <Button type="link" onClick={() => router.push("/login")}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SetupForm;
