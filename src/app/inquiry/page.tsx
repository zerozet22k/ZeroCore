"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Input, Tag, Spin, Pagination, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { InquiryAPI } from "@/models/InquiryModel";
import { useUser } from "@/hooks/useUser";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";

const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryAPI[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useUser();

  const canCreateInquiry =
    user && hasPermission(user, [APP_PERMISSIONS.POST_INQUIRY]);

  useEffect(() => {
    fetchInquiries();
  }, [searchText, page, limit]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/inquiry?search=${searchText}&page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        setInquiries(response.data.inquiries);
        setTotal(Number(response.data.total) || 0);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      message.error("Failed to load inquiries.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        flexGrow: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1 style={{ margin: 0, flex: "1 1 auto" }}>Community Inquiries</h1>
        {canCreateInquiry && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/inquiry/create")}
            style={{ whiteSpace: "nowrap" }}
          >
            Ask a Question
          </Button>
        )}
      </div>
      <Input
        placeholder="Search inquiries..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          marginBottom: "10px",
          width: "100%",
          maxWidth: "800px",
        }}
      />
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <Spin size="large" style={{ alignSelf: "center", margin: "auto" }} />
        ) : inquiries.length === 0 ? (
          <p style={{ textAlign: "center", flexGrow: 1 }}>
            No inquiries found.
          </p>
        ) : (
          inquiries.map((inquiry) => (
            <Card
              key={inquiry._id}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s",
                marginBottom: "10px",
                boxShadow: "none",
              }}
              onClick={() => router.push(`/inquiry/${inquiry._id}`)}
            >
              <h3>{inquiry.text}</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <span style={{ fontWeight: "thin" }}>
                  {inquiry.user ? inquiry.user.name : "[Deleted User]"}
                </span>
                <Tag color={inquiry.isClosed ? "red" : "green"}>
                  {inquiry.isClosed ? "Closed" : "Open"}
                </Tag>
              </div>
            </Card>
          ))
        )}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        <Pagination
          current={page}
          total={total || 0}
          pageSize={limit || 10}
          onChange={(newPage) => setPage(newPage)}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onShowSizeChange={(_, newSize) => {
            setLimit(Number(newSize) || 10);
          }}
        />
      </div>
    </div>
  );
};

export default InquiriesPage;
