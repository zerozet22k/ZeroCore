"use client";

import React, { ReactNode, CSSProperties } from "react";
import { Layout, Typography } from "antd";
import SendMailForm from "./SendMailForm";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface PageWrapperProps {
  pageContent: {
    title: LanguageJson;
    subtitle: LanguageJson;
    description: LanguageJson;
    backgroundImage?: string;
  };
  children: ReactNode;
  style?: CSSProperties;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  pageContent,
  children,
  style,
}) => {
  const { language } = useLanguage();

  return (
    <Layout style={{ width: "100%", maxWidth: "100%", padding: 0, ...style }}>
      {/* ✅ Full-Width Hero Section */}
      <div
        style={{
          width: "100%",
          height: 350,
          ...(pageContent.backgroundImage
            ? {
                background: `url('${pageContent.backgroundImage}') center/cover no-repeat`,
              }
            : {}),
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            padding: "20px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#fff",
              textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            {getTranslatedText(pageContent.title, language)}
          </Title>
          <Title level={3} style={{ color: "#fff", marginTop: 10 }}>
            {getTranslatedText(pageContent.subtitle, language)}
          </Title>
          <Paragraph style={{ color: "#ddd", fontSize: 16, marginTop: 10 }}>
            {getTranslatedText(pageContent.description, language)}
          </Paragraph>
        </div>
      </div>

      {/* ✅ Full-Width Main Content */}
      <Content
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "24px 0",
          background: "#fff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            padding: "0 24px",
          }}
        >
          {children}
        </div>
      </Content>

      <div style={{ width: "100%" }}>
        <SendMailForm />
      </div>
    </Layout>
  );
};

export default PageWrapper;
