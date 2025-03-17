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
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { RoleAPI, RoleType } from "@/models/RoleModel";

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get("/roles");
        if (response.status === 200) {
          setRoles(response.data);
        } else {
          message.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error("An error occurred while fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (roleId: string) => {
    try {
      const response = await apiClient.delete(`/roles/${roleId}`);
      if (response.status === 200) {
        message.success("Role deleted successfully");
        setRoles(roles.filter((role) => role._id !== roleId));
      } else {
        message.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      message.error("An error occurred while deleting the role");
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: RoleAPI, b: RoleAPI) => a.name.localeCompare(b.name),
      render: (text: string, record: RoleAPI) => (
        <a onClick={() => router.push(`/dashboard/roles/${record._id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: RoleType) => (
        <Tag
          color={
            type === RoleType.SYSTEM
              ? "red"
              : type === RoleType.GUEST
              ? "blue"
              : "green"
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: RoleAPI) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/roles/${record._id}`)}
          >
            Edit
          </Button>
          {record.type !== RoleType.SYSTEM &&
            record.type !== RoleType.GUEST && (
              <Popconfirm
                title="Are you sure to delete this role?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Roles Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/roles/create")}
        >
          Create Role
        </Button>
      }
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Input
        placeholder="Search roles"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<RoleAPI>
        columns={columns}
        dataSource={filteredRoles}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default RolesPage;
