"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";

import { UserAPI } from "@/models/UserModel";
import apiClient from "@/utils/api/apiClient";

interface ProfileUpdateFormProps {
  user: UserAPI;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  user,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          username: user.username,
          email: user.email,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, user, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const payload = { ...values };
      if (!values.password) {
        delete payload.password;
      }

      await apiClient.put("/me", payload);

      message.success("Profile updated successfully!");
      form.resetFields(["password"]);
      if (onSuccess) {
        onSuccess();
      }
      handleCancel();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update the profile";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      key={user?._id || "profile-modal"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password
            placeholder="Leave blank to keep the current password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileUpdateForm;
