"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Input, Button, Spin, message, Typography, theme, Tag } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
import apiClient from "@/utils/api/apiClient";
import { InquiryAPI, ReplyAPI } from "@/models/InquiryModel";
import { useUser } from "@/hooks/useUser";
import { debounce } from "lodash";
import { APP_PERMISSIONS, hasPermission } from "@/config/permissions";
import { useLayout } from "@/contexts/LayoutContext";
import { useSettings } from "@/hooks/useSettings";
import Pusher from "pusher-js";

const { Title, Text } = Typography;

const InquiryPage: React.FC = () => {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState<InquiryAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { token } = theme.useToken();
  const { pusherConfig } = useSettings();

  useEffect(() => {
    if (!id) return;
    fetchInquiry();
  }, [id]);

  const fetchInquiry = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/inquiry/${id}`);
      setInquiry(response.data || null);
    } catch {
      message.error("Failed to load inquiry");
    }
    setLoading(false);
  };

  const canReplyToInquiry =
    user &&
    (hasPermission(user, [APP_PERMISSIONS.REPLY_TO_ANY_INQUIRY]) ||
      (hasPermission(user, [APP_PERMISSIONS.REPLY_TO_OWN_INQUIRY]) &&
        inquiry?.user?._id === user?._id));

  const sendReply = async () => {
    if (!replyText.trim()) return message.warning("Reply cannot be empty.");
    if (!user) return message.error("You must be logged in to reply.");

    setIsSubmitting(true);
    try {
      await apiClient.post(`/inquiry/${id}/reply`, { text: replyText });
      setReplyText("");
      // We now expect the "new-reply" event to update the state
      // Optionally, you could call fetchInquiry() here if needed
    } catch {
      message.error("Failed to send reply.");
    }
    setIsSubmitting(false);
  };

  const deleteReply = async (replyId: string) => {
    try {
      await apiClient.delete(`/inquiry/${id}/reply/${replyId}`);
      message.success("Reply deleted.");
      fetchInquiry();
    } catch {
      message.error("Failed to delete reply.");
    }
  };

  const debouncedReply = useCallback(debounce(sendReply, 500), [replyText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [inquiry]);

  // Pusher subscription for real-time updates using settings-based config
  useEffect(() => {
    if (!pusherConfig) return;
    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
    });
    const channel = pusher.subscribe("inquiries");

    channel.bind("new-inquiry", (data: any) => {
      message.info("New inquiry received!");
      // If the new inquiry is the one being viewed, update state.
      if (data.inquiry && data.inquiry._id === id) {
        setInquiry(data.inquiry);
      } else {
        fetchInquiry();
      }
    });

    channel.bind("updated-inquiry", (data: any) => {
      message.info("An inquiry was updated.");
      if (data.inquiry && data.inquiry._id === id) {
        setInquiry(data.inquiry);
      } else {
        fetchInquiry();
      }
    });

    channel.bind("deleted-inquiry", (data: any) => {
      message.info("An inquiry was deleted.");
      if (data.inquiryId && data.inquiryId === id) {
        setInquiry(null);
      } else {
        fetchInquiry();
      }
    });

    channel.bind("closed-inquiry", (data: any) => {
      message.info("An inquiry was closed.");
      if (data.inquiry && data.inquiry._id === id) {
        setInquiry(data.inquiry);
      } else {
        fetchInquiry();
      }
    });

    // Bind new-reply event more specifically
    channel.bind("new-reply", (data: any) => {
      if (data.inquiry && data.inquiry._id === id) {
        message.info("A new reply was added to this inquiry.");
        // Instead of fetching the entire inquiry, update state with the payload
        setInquiry(data.inquiry);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [pusherConfig, id]);

  if (loading)
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "auto", marginTop: "20vh" }}
      />
    );

  if (!inquiry)
    return (
      <Text style={{ textAlign: "center", marginTop: "20px" }}>
        Inquiry not found.
      </Text>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: token.colorBgContainer,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "15px",
          borderTop: `1px solid #ddd`,
          background: "#fafafa",
          boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={4}
              style={{
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {inquiry.text}
            </Title>
            <Text type="secondary">
              {inquiry.user?._id === user?._id
                ? ""
                : `By ${inquiry.user?.name}`}
            </Text>
          </div>
          <Tag color={inquiry.isClosed ? "red" : "green"}>
            {inquiry.isClosed ? "Closed" : "Open"}
          </Tag>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "20px",
          paddingBottom: "80px",
        }}
      >
        {inquiry.replies.length === 0 ? (
          <Text type="secondary">No replies yet. Be the first to respond!</Text>
        ) : (
          inquiry.replies.map((reply) => (
            <ReplyThread
              key={reply._id}
              reply={reply}
              currentUser={user}
              onDelete={deleteReply}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {!inquiry.isClosed && canReplyToInquiry && (
        <div style={{ padding: "15px" }}>
          <Text style={{ fontWeight: 500 }}>Post a Reply</Text>
          <div style={{ marginTop: "8px" }}>
            <Input.TextArea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={debouncedReply}
              loading={isSubmitting}
              style={{ marginTop: "8px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ReplyThread: React.FC<{
  reply: ReplyAPI;
  currentUser: any;
  onDelete: (replyId: string) => void;
}> = ({ reply, currentUser, onDelete }) => {
  const { token } = theme.useToken();
  const isCurrentUser = reply.user?._id === currentUser?._id;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 0",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong>{isCurrentUser ? "You" : reply.user?.name}</Text>
          <Text style={{ fontSize: "12px", color: "#999" }}>
            {new Date(reply.createdAt).toLocaleString()}
          </Text>
        </div>
        <div
          style={{
            marginTop: "5px",
            padding: "10px",
            borderRadius: "6px",
            background: isCurrentUser ? token.colorBgContainer : "#F1F1F1",
          }}
        >
          <Text>{reply.text}</Text>
        </div>
      </div>
      {isCurrentUser && (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(reply._id)}
          style={{ marginTop: "5px", alignSelf: "flex-end" }}
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default InquiryPage;
