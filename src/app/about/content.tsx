"use client";

import React from "react";
import { Card, Row, Col, Typography, Image } from "antd";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import PageWrapper from "@/components/PageWrapper";
import {
  ABOUT_PAGE_SETTINGS_KEYS,
  ABOUT_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/ABOUT_PAGE_SETTINGS";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";

const { Title, Paragraph } = Typography;

interface AboutUsContentProps {
  data: ABOUT_PAGE_SETTINGS_TYPES;
}

const AboutUsContent: React.FC<AboutUsContentProps> = ({ data }) => {
  const { language } = useLanguage();
  const pageContent = data[ABOUT_PAGE_SETTINGS_KEYS.PAGE_CONTENT] || {};
  const sections = data[ABOUT_PAGE_SETTINGS_KEYS.SECTIONS] || [];
  const design = data[ABOUT_PAGE_SETTINGS_KEYS.DESIGN] || {};
  const typography = design.typography || {};

  return (
    <PageWrapper pageContent={pageContent}>
      <Row
        gutter={[
          parseInt(design.gridGutter) || 32,
          parseInt(design.gridGutter) || 32,
        ]}
        justify="center"
        align="top"
        style={{
          display: "flex",
          margin: "0 auto",
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        {sections.map((section, index) => (
          <Col
            key={index}
            xs={24}
            sm={section.sm}
            md={section.md}
            lg={section.lg}
            xl={section.xl}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              <Card
                style={{
                  width: "100%",
                  padding: "30px",
                  height: "100%",
                  borderRadius: design.borderRadius || "12px",
                  boxShadow:
                    design.cardStyle === "shadow"
                      ? "0px 6px 16px rgba(0, 0, 0, 0.12)"
                      : "none",
                  textAlign: design.textAlign || "left",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Section Image */}
                {design.showImages && section.image && (
                  <Image
                    src={section.image}
                    alt={getTranslatedText(section.title, language)}
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "16px",
                      borderRadius: "8px",
                    }}
                    preview={false}
                  />
                )}

                {/* Section Icon */}
                {design.showIcons && section.icon && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: design.textAlign || "left",
                      marginBottom: "12px",
                    }}
                  >
                    <DynamicIcon
                      name={section.icon}
                      style={{ fontSize: "32px", color: "#1890ff" }}
                    />
                  </div>
                )}

                {/* Section Text Content */}
                <div style={{ width: "100%" }}>
                  <Title
                    level={3}
                    style={{
                      fontSize: typography.titleSize || "1.5em",
                      fontWeight: 700,
                      color: typography.color || "#333",
                    }}
                  >
                    {getTranslatedText(section.title, language)}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: typography.descriptionSize || "1em",
                      color: typography.color || "#333",
                    }}
                  >
                    {getTranslatedText(section.description, language)}
                  </Paragraph>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </PageWrapper>
  );
};

export default AboutUsContent;
