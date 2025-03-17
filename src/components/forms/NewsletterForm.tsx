"use client";

import React, { useEffect, useState } from "react";
import { Form, Button, Card, message, Divider, Upload, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import { INewsletterAPI } from "@/models/Newsletter";
import LanguageTextInput from "../LanguageTextInput";

interface NewsletterFormProps {
  newsletter?: INewsletterAPI;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ newsletter }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  // Main newsletter submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  // Store current newsletter (for attachments management)
  const [currentNewsletter, setCurrentNewsletter] =
    useState<INewsletterAPI | null>(newsletter || null);

  // Attachment states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deletingAttachmentIds, setDeletingAttachmentIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (newsletter) {
      form.setFieldsValue(newsletter);
      setCurrentNewsletter(newsletter);
    } else {
      form.resetFields();
      setCurrentNewsletter(null);
    }
  }, [newsletter, form]);

  // Handle file selection via Upload component
  const handleBeforeUpload = (file: File) => {
    setSelectedFile(file);
    // Return false to prevent automatic upload
    return false;
  };

  /**
   * Main submit function: creates/updates newsletter title.
   */
  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      if (currentNewsletter?._id) {
        const response = await apiClient.put(
          `/newsletters/${currentNewsletter._id}`,
          values
        );
        if (response.status === 200) {
          message.success("Newsletter updated successfully!");
          setCurrentNewsletter(response.data.newsletter);
        } else {
          message.error("Failed to update newsletter.");
          return;
        }
      } else {
        const response = await apiClient.post("/newsletters", values);
        if (response.status === 201) {
          message.success("Newsletter created successfully!");
          setCurrentNewsletter(response.data.newsletter);
        } else {
          message.error("Failed to create newsletter.");
          return;
        }
      }
    } catch (error: any) {
      console.error("Error submitting newsletter form:", error);
      message.error("An error occurred while submitting the form.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handles adding an attachment.
   */
  const handleAddAttachment = async () => {
    if (!selectedFile) {
      message.warning("Please select a file to upload.");
      return;
    }
    if (!currentNewsletter?._id) {
      message.error("Newsletter must be created before adding attachments.");
      return;
    }
    setUploading(true);
    try {
      // 1) Get the upload URL and filePath from server
      const signResponse = await apiClient.post(
        `/newsletters/${currentNewsletter._id}/attachment/signurl`,
        {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        }
      );
      if (signResponse.status !== 200) {
        message.error("Failed to get upload URL for attachment");
        return;
      }
      const { uploadUrl, filePath } = signResponse.data;
      if (!uploadUrl || !filePath) {
        message.error("Missing uploadUrl or filePath in server response");
        return;
      }

      // 2) Upload the file using the obtained uploadUrl
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      if (!uploadResponse.ok) {
        message.error("File upload failed");
        return;
      }

      // 3) Inform the server of the new attachment with minimal required fields
      const attachmentPayload = {
        attachment: {
          rawFilePath: filePath,
          size: selectedFile.size,
        },
      };
      const addResponse = await apiClient.post(
        `/newsletters/${currentNewsletter._id}/attachment`,
        attachmentPayload
      );
      if (addResponse.status !== 201) {
        console.error("Add Attachment error:", addResponse);
        message.error("Failed to add attachment to newsletter");
      } else {
        message.success("Attachment uploaded successfully");
        // Clear file selection
        setSelectedFile(null);
        // Update local newsletter data with the new attachment
        setCurrentNewsletter(addResponse.data.newsletter);
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
      message.error("An error occurred while uploading the attachment");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Deletes an existing attachment.
   */
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!currentNewsletter?._id) return;
    if (deletingAttachmentIds.includes(attachmentId)) return;

    setDeletingAttachmentIds((prev) => [...prev, attachmentId]);
    try {
      const res = await apiClient.delete(
        `/newsletters/${currentNewsletter._id}/attachment/${attachmentId}`
      );
      if (res.status === 200) {
        message.success("Attachment deleted successfully");
        setCurrentNewsletter((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            fileAttachments: prev.fileAttachments.filter(
              (att) => att._id !== attachmentId
            ),
          };
        });
      } else {
        message.error("Failed to delete attachment");
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      message.error("An error occurred while deleting the attachment");
    } finally {
      setDeletingAttachmentIds((prev) =>
        prev.filter((id) => id !== attachmentId)
      );
    }
  };

  return (
    <Card
      title={currentNewsletter?._id ? "Edit Newsletter" : "Create Newsletter"}
      style={{ maxWidth: 700, margin: "20px auto", padding: 24 }}
    >
      {/* Main Newsletter Form */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter the newsletter title" },
          ]}
        >
          <LanguageTextInput />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            {currentNewsletter?._id ? "Update Newsletter" : "Create Newsletter"}
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      {/* Attachment Section: Visible only when newsletter exists */}
      {currentNewsletter?._id && (
        <Card type="inner" title="Attachments" style={{ marginTop: 16 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleAddAttachment}
                loading={uploading}
              >
                Add Attachment
              </Button>
            </Space>
            {selectedFile && (
              <div style={{ marginTop: 8 }}>
                Selected file: <strong>{selectedFile.name}</strong>
              </div>
            )}
            {currentNewsletter.fileAttachments?.length > 0 && (
              <>
                <Divider orientation="left">Existing Attachments</Divider>
                {currentNewsletter.fileAttachments.map((attachment) => (
                  <Space
                    key={attachment._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{attachment.fileName || "No Name"}</span>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAttachment(attachment._id)}
                      loading={deletingAttachmentIds.includes(attachment._id)}
                    >
                      Delete
                    </Button>
                  </Space>
                ))}
              </>
            )}
          </Space>
        </Card>
      )}
    </Card>
  );
};

export default NewsletterForm;
