"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
  Select,
  Alert,
  Spin,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import ProfileAvatar from "../ProfileAvatar";
import PublicAPIDynamicMultiSelect from "../inputs/PublicAPIDynamicMultiSelect";
import { APP_PERMISSIONS } from "@/config/permissions";
import { useUser } from "@/hooks/useUser";
import { RoleAPI, RoleType } from "@/models/RoleModel";

const { Option } = Select;
const phoneTypes = ["Work", "Mobile", "Fax", "Home", "Other"];

interface UserFormProps {
  user?: UserAPI;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user: currentUser } = useUser();

  const currentUserHighestLevel =
    currentUser?.roles && currentUser.roles.length > 0
      ? Math.max(...currentUser.roles.map((r: any) => r.level))
      : 0;

  const canBindRoles =
    currentUser?.roles?.some((role) =>
      role.permissions.includes(APP_PERMISSIONS.BIND_ROLE)
    ) || false;

  useEffect(() => {
    if (user) {
      // Pre-fill the form if we're editing an existing user
      form.setFieldsValue({
        ...user,
        role_ids: user.roles?.map((role) => role._id) || [],
        phones: user.phones || [],
        position: user.position || "",
        avatar: user.avatar || "/images/default-avatar.webp",
        cover_image: user.cover_image || "/images/team-banner.jpg",
      });
    } else {
      // Creating a new user: optionally reset or set default fields here
      form.resetFields();
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData = {
        ...values,
        // Only include password if provided
        ...(values.password ? { password: values.password } : {}),
      };

      if (user?._id) {
        // Editing existing user
        await apiClient.put(`/users/${user._id}`, userData);
        message.success("User updated successfully!");
      } else {
        // Creating new user
        await apiClient.post("/users", userData);
        message.success("User created successfully!");
      }
      router.push("/dashboard/users");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      message.error(
        error.response?.data?.message || "Failed to submit the form."
      );
    } finally {
      setLoading(false);
    }
  };

  const formTitle = user ? "Edit User" : "Create User";

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <Row gutter={[24, 24]}>
        {/* If user is defined, show the left column with ProfileAvatar */}
        {user && (
          <Col xs={24} md={8}>
            <ProfileAvatar
              user={user}
              onAvatarChange={(avatarUrl) =>
                form.setFieldsValue({ avatar: avatarUrl })
              }
              onCoverChange={(coverUrl) =>
                form.setFieldsValue({ cover_image: coverUrl })
              }
            />
          </Col>
        )}

        {/* If user is undefined, this column becomes full width (24). Otherwise, 16. */}
        <Col xs={24} md={user ? 16 : 24}>
          <Card title={formTitle}>
            {/* Alert if current user cannot bind roles */}
            {!canBindRoles && (
              <Alert
                message="You do not have permission to bind roles."
                type="error"
                showIcon
                style={{ marginBottom: 10 }}
              />
            )}

            <Spin spinning={loading}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        { required: true, message: "Please enter the name" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        { required: true, message: "Please enter a username" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter an email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Password" name="password">
                      <Input.Password placeholder="Leave blank to keep current password" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Roles"
                      name="role_ids"
                      rules={[
                        {
                          required: true,
                          message: "Please select at least one role",
                        },
                      ]}
                    >
                      <PublicAPIDynamicMultiSelect
                        type="roles"
                        valueKey="_id"
                        labelKey="name"
                        placeholder="Select roles"
                        disabled={!canBindRoles}
                        filterOptions={(option: any) =>
                          option.level < currentUserHighestLevel
                        }
                        nonRemovableFilter={(option: RoleAPI) =>
                          option.type === RoleType.SYSTEM
                        }
                        initialValue={user ? user.roles.map((r) => r._id) : []}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Position"
                      name="position"
                      rules={[
                        { required: true, message: "Please enter the position" },
                      ]}
                    >
                      <Input placeholder="Enter job title" />
                    </Form.Item>
                  </Col>

                  {/* Phone Numbers */}
                  <Col xs={24}>
                    <Form.Item label="Phone Numbers">
                      <Form.List name="phones">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Row key={key} gutter={[8, 8]} align="middle">
                                <Col flex="160px">
                                  <Form.Item
                                    {...restField}
                                    name={[name, "type"]}
                                    rules={[
                                      { required: true, message: "Select type" },
                                    ]}
                                    style={{ marginBottom: "4px" }}
                                  >
                                    <Select placeholder="Select type">
                                      {phoneTypes.map((type) => (
                                        <Option key={type} value={type}>
                                          {type}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col flex="auto">
                                  <Form.Item
                                    {...restField}
                                    name={[name, "number"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Enter phone number",
                                      },
                                    ]}
                                    style={{ marginBottom: "4px" }}
                                  >
                                    <Input placeholder="Phone Number" />
                                  </Form.Item>
                                </Col>
                                <Col flex="40px">
                                  <Button
                                    danger
                                    onClick={() => remove(name)}
                                    icon={<MinusCircleOutlined />}
                                    style={{ marginBottom: "4px" }}
                                  />
                                </Col>
                              </Row>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              style={{ marginTop: "8px" }}
                            >
                              Add Phone
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Bio" name="bio">
                      <Input.TextArea
                        rows={4}
                        placeholder="Tell us a bit about yourself"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: "100%", maxWidth: "280px" }}
                  >
                    {user ? "Update User" : "Create User"}
                  </Button>
                </div>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserForm;
