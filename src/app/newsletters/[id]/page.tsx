"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Spin,
  Alert,
  Typography,
  Button,
  List,
  Row,
  Col,
  Card,
  Space,
} from "antd";
import apiClient from "@/utils/api/apiClient";
import { INewsletterAPI } from "@/models/Newsletter";

const { Paragraph } = Typography;

type Attachment = INewsletterAPI["fileAttachments"][0];

interface AttachmentPreviewProps {
  attachment: Attachment;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
}) => {
  const getFileExtension = (fileName: string) => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  };

  const ext = getFileExtension(attachment.fileName);

  if (ext === "pdf") {
    return (
      <iframe
        src={attachment.publicUrl}
        style={{ width: "100%", height: "600px", border: "none" }}
        title={attachment.fileName}
      />
    );
  } else if (ext === "docx" || ext === "doc") {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      attachment.publicUrl
    )}&embedded=true`;
    return (
      <iframe
        src={viewerUrl}
        style={{ width: "100%", height: "600px", border: "none" }}
        title={attachment.fileName}
      />
    );
  }

  return (
    <Space direction="vertical">
      <Paragraph>Preview is not available for this file type.</Paragraph>
    </Space>
  );
};

interface AttachmentListProps {
  attachments: Attachment[];
  selectedAttachment: Attachment | null;
  onSelect: (attachment: Attachment) => void;
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  selectedAttachment,
  onSelect,
}) => (
  <List
    bordered
    dataSource={attachments}
    renderItem={(attachment: Attachment) => (
      <List.Item
        style={{
          cursor: "pointer",
          background:
            selectedAttachment?._id === attachment._id
              ? "#e6f7ff"
              : "transparent",
        }}
        onClick={() => onSelect(attachment)}
      >
        {attachment.fileName}
      </List.Item>
    )}
  />
);

const NewsletterDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState<INewsletterAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);

  const fetchNewsletter = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/newsletters/${id}`);
      if (response.status === 200 && response.data) {
        setNewsletter(response.data);
        if (
          response.data.fileAttachments &&
          response.data.fileAttachments.length > 0
        ) {
          setSelectedAttachment(response.data.fileAttachments[0]);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching newsletter:", err);
      setError("Failed to load newsletter.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsletter();
  }, [fetchNewsletter]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "40px auto", maxWidth: "800px" }}
      />
    );
  }

  if (!newsletter) {
    return (
      <Paragraph style={{ textAlign: "center" }}>
        No newsletter found.
      </Paragraph>
    );
  }

  const newsletterTitle =
    typeof newsletter.title === "string"
      ? newsletter.title
      : newsletter.title.en || "Untitled";

  return (
    <div style={{ width: "100%", margin: "0 auto", padding: "40px 20px" }}>
      <Row gutter={[24, 24]}>
        {newsletter.fileAttachments && newsletter.fileAttachments.length > 0 ? (
          <>
            <Col xs={24} md={6}>
              <Card
                title={newsletterTitle}
                bordered
                style={{ height: "100%" }}
                extra={
                  <Button type="primary" onClick={() => router.back()}>
                    Back
                  </Button>
                }
              >
                <AttachmentList
                  attachments={newsletter.fileAttachments}
                  selectedAttachment={selectedAttachment}
                  onSelect={setSelectedAttachment}
                />
              </Card>
            </Col>
            <Col xs={24} md={18}>
              <Card
                title={`Preview: ${selectedAttachment?.fileName}`}
                extra={
                  selectedAttachment && (
                    <Button
                      type="primary"
                      href={selectedAttachment.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                  )
                }
                bordered
              >
                {selectedAttachment && (
                  <AttachmentPreview attachment={selectedAttachment} />
                )}
              </Card>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Card
              title={newsletterTitle}
              bordered
              extra={
                <Button type="primary" onClick={() => router.back()}>
                  Back
                </Button>
              }
            >
              <Paragraph>No attachments available.</Paragraph>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default NewsletterDetail;
