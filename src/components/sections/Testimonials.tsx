import React from "react";
import { Card, Typography, Divider } from "antd";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";

const { Title, Text } = Typography;

type TestimonialsProps = {
  testimonials: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS];
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const { language } = useLanguage();

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "40px 20px",
      }}
    >
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
      >
        What Our Clients Say
      </Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            style={{
              maxWidth: "400px",
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <Text
              style={{
                fontStyle: "italic",
                fontSize: "16px",
                marginBottom: "12px",
                display: "block",
                color: "#555",
              }}
            >
              “{getTranslatedText(testimonial.comment, language)}”
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <Text
              strong
              style={{
                fontSize: "18px",
                display: "block",
                textAlign: "right",
                color: "#333",
              }}
            >
              {getTranslatedText(testimonial.name, language)}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
