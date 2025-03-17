"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Card } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";

// Helper function to format bytes into human-readable sizes.
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const NewslettersPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/newsletters");
        console.log("Fetched newsletters:", response.data);
        if (response.status === 200) {
          setNewsletters(response.data.newsletters);
        } else {
          message.error("Failed to fetch newsletters");
        }
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        message.error("An error occurred while fetching newsletters");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  // Enhanced filtering: if title is a string, search directly; if an object, search all values.
  const filteredNewsletters = newsletters.filter((n) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    if (typeof n.title === "string") {
      return n.title.toLowerCase().includes(searchLower);
    } else if (typeof n.title === "object" && n.title !== null) {
      return Object.values(n.title).some((val) =>
        (val as string)?.toLowerCase().includes(searchLower)
      );
    }
    return false;
  });

  const handleDelete = async (id: string) => {
    // Prevent duplicate deletion clicks by checking if id is already deleting.
    if (deletingIds.includes(id)) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      const response = await apiClient.delete(`/newsletters/${id}`);
      if (response.status === 200) {
        message.success("Newsletter deleted successfully");
        setNewsletters((prev) => prev.filter((n) => n._id !== id));
      } else {
        message.error("Failed to delete newsletter");
      }
    } catch (error) {
      message.error("An error occurred while deleting the newsletter");
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: any, record: any) => {
        let displayTitle = "";
        if (typeof title === "string") {
          displayTitle = title;
        } else if (typeof title === "object" && title !== null) {
          displayTitle = title.en || "No Title";
        }
        return (
          <a
            onClick={() => router.push(`/dashboard/newsletters/${record._id}`)}
          >
            {displayTitle}
          </a>
        );
      },
    },
    {
      title: "Attachments",
      dataIndex: "fileAttachments",
      key: "attachments",
      render: (attachments: any[]) => {
        if (!attachments || attachments.length === 0) {
          return "None";
        }
        return attachments
          .map((att) => {
            // Display file name along with formatted size
            const name = att.fileName || "Unnamed";
            const size = att.size ? ` (${formatBytes(att.size)})` : "";
            return `${name}${size}`;
          })
          .join(", ");
      },
      // Add styling to truncate if text is too long.
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 200,
        },
      }),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/newsletters/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            loading={deletingIds.includes(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Newsletters Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/newsletters/create")}
        >
          Create Newsletter
        </Button>
      }
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Input
        placeholder="Search newsletters (by title)"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredNewsletters}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default NewslettersPage;
