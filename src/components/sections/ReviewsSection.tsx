"use client";

import React from "react";
import { Row, Col, Card, Typography, Avatar, Rate } from "antd";
import CustomCarousel from "@/components/CustomCarousel";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";

const { Title, Text } = Typography;

type ReviewsSectionProps = {
  testimonials: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS];
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ testimonials }) => {
  const { language } = useLanguage();

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: "80px 20px",
        background: "linear-gradient(180deg, #ffffff, #f0f2f5)",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        What Our Students Say
      </Title>

      <CustomCarousel autoplay slidesToShow={1} dots>
        {testimonials.map((review, index) => (
          <div key={index}>
            <Row
              justify="center"
              align="middle"
              style={{
                marginBottom: "20px",
                minHeight: "250px",
              }}
            >
              <Col xs={24} md={16} lg={10}>
                <Card
                  hoverable
                  style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  bodyStyle={{
                    padding: "24px",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar
                      src={"/images/default-avatar.webp"}
                      size={72}
                      style={{
                        marginRight: "16px",
                        border: "3px solid #1890ff",
                      }}
                    />
                    <div>
                      <Title
                        level={4}
                        style={{ marginBottom: "4px", fontSize: "20px" }}
                      >
                        {getTranslatedText(review.name, language)}
                      </Title>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>
                  <Text
                    style={{
                      display: "block",
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#595959",
                    }}
                  >
                    {getTranslatedText(review.comment, language)}
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        ))}
      </CustomCarousel>
    </div>
  );
};

export default ReviewsSection;
