"use client";

import React from "react";
import { Form, Input, Button, Typography, Row, Col, message, Card } from "antd";
import { PagesInterface } from "@/config/CMS/pages/pageKeys";
import { HOME_PAGE_SETTINGS_KEYS } from "@/config/CMS/pages/HOME_PAGE_SETTINGS";
import apiClient from "@/utils/api/apiClient";

const { Title, Text } = Typography;

type ContactUsSectionProps = {
  contactInfo: PagesInterface[typeof HOME_PAGE_SETTINGS_KEYS.CONTACT_US];
};

const ContactUsSection: React.FC<ContactUsSectionProps> = ({ contactInfo }) => {
  const handleSubmit = async (values: any) => {
    try {
      const response = await apiClient.post("/contact-us", values);

      if (response.status === 200) {
        message.success(response.data.message || "Message sent successfully!");
      } else {
        message.error(response.data.error || "Failed to send your message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div
      style={{
        padding: "60px 20px",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Contact Us
      </Title>

      <Row
        gutter={[40, 40]}
        justify="center"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Contact Form */}
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Card title={"Contact Form"} style={{ height: "100%" }}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Your Name" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input placeholder="Your Email" />
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Your Message" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Contact Information */}
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Card title={"Our Location"} style={{ height: "100%" }}>
            <Text style={{ display: "block", marginBottom: "10px" }}>
              Address: {contactInfo.address}
            </Text>
            <Text style={{ display: "block", marginBottom: "10px" }}>
              Phone: {contactInfo.phone}
            </Text>
            <Text style={{ display: "block", marginBottom: "20px" }}>
              Email: {contactInfo.email}
            </Text>

            {/* Google Maps Embed */}
            <div style={{ marginTop: "20px" }}>
              <iframe
                src={contactInfo.mapLink}
                width="100%"
                height="400"
                style={{
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUsSection;
