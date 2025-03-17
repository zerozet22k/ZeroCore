"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Tag,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";

import apiClient from "@/utils/api/apiClient";
import { UserAPI } from "@/models/UserModel";
import { RoleAPI, RoleType } from "@/models/RoleModel";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          message.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      if (response.status === 200) {
        message.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        message.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("An error occurred while deleting the user");
    }
  };

  const columns: ColumnsType<UserAPI> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text: string, record: UserAPI) => (
        <a onClick={() => router.push(`/dashboard/users/${record._id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => (a.position || "").localeCompare(b.position || ""),
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      render: (bio: string) => (
        <Tooltip title={bio}>
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
            {bio}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: RoleAPI[]) => (
        <>
          {roles?.map((role) => (
            <Tag key={role._id} color={role.color || "red"}>
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const hasSystemRole = record.roles.some(
          (role) => role.type === RoleType.SYSTEM
        );
        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/users/${record._id}`)}
            >
              Edit
            </Button>
            {hasSystemRole ? (
              <Tooltip title="Cannot delete a user with system role">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  disabled
                >
                  Delete
                </Button>
              </Tooltip>
            ) : (
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDelete(record._id.toString())}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Users Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/users/create")}
        >
          Create User
        </Button>
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search users"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<UserAPI>
        columns={columns}
        dataSource={users.filter(
          (user) =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default UsersPage;
