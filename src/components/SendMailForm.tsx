import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import apiClient from "@/utils/api/apiClient"; // your configured axios instance

const SendMailForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSendEmail = async (values: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/send-email", {
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      if (response.status === 200) {
        notification.success({
          message: "Email sent successfully!",
        });
        form.resetFields();
        setVisible(false);
      } else {
        throw new Error(response.data.error || "Failed to send email");
      }
    } catch (error: any) {
      notification.error({
        message:
          error?.message || "Failed to send email, please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          padding: "30px",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Need Legal Assistance?
        </h2>
        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#555" }}>
          Contact us today for a consultation and let us help you navigate your
          legal matters with confidence.
        </p>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: "10px", fontSize: "18px" }}
          onClick={() => setVisible(true)}
        >
          Get in Touch
        </Button>
      </div>

      <Modal
        title="Send Email"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          <Form.Item
            label="Your Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please input the subject!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SendMailForm;
