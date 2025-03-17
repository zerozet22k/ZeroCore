"use client";

import React from "react";
import { Row, Col, Card } from "antd";
import PageWrapper from "@/components/PageWrapper";
import { DynamicIcon } from "@/config/navigations/IconMapper";
import { useLanguage } from "@/hooks/useLanguage";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  SERVICES_PAGE_SETTINGS_KEYS,
  SERVICES_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/SERVICES_PAGE_SETTINGS";

type ServicesContentProps = {
  data: SERVICES_PAGE_SETTINGS_TYPES;
};

const ServicesContent: React.FC<ServicesContentProps> = ({ data }) => {
  const { language } = useLanguage();

  const pageContent = data[SERVICES_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const servicesList = data[SERVICES_PAGE_SETTINGS_KEYS.SERVICES_LIST];

  return (
    <PageWrapper pageContent={pageContent}>
      <Row gutter={[16, 16]}>
        {servicesList.map((service, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              title={
                <>
                  <DynamicIcon
                    name={service.icon}
                    style={{ color: service.iconColor, fontSize: "24px" }}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {getTranslatedText(service.title, language)}
                  </span>
                </>
              }
              bordered={false}
              style={{
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "16px", color: "#555" }}>
               {getTranslatedText(service.description, language)}  {getTranslatedText(service.description, language)}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </PageWrapper>
  );
};

export default ServicesContent;
