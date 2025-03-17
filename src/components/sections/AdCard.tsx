import React from "react";
import { Card, Typography, Divider } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";

const { Title, Text } = Typography;

const AdCard: React.FC<{
  ad: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.ADS][number];
}> = ({ ad }) => {
  const { language } = useLanguage();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500, // keep it from stretching too wide
        margin: "0 auto",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Top Banner with Gradient Overlay */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundImage: `url(${ad.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient overlay at bottom of the banner */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "40%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), rgba(255,255,255,0))",
          }}
        />
      </div>

      {/* Card Content */}
      <Card
        bordered={false}
        style={{
          borderRadius: 0, // matches outer container
          padding: "16px 20px",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ marginTop: 16 }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 20,
              color: "#333",
              lineHeight: 1.3,
            }}
          >
            {getTranslatedText(ad.title, language)}
          </Title>

          <Text
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 14,
              color: "#666",
            }}
          >
            {getTranslatedText(ad.subtitle, language)}
          </Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, lineHeight: 1.5, color: "#444" }}>
            {getTranslatedText(ad.description, language)}
          </Text>
        </div>

        {/* Divider above contacts */}
        <Divider style={{ margin: "16px 0" }} />

        {/* Contacts Section */}
        <div style={{ marginBottom: 8 }}>
          <Title
            level={5}
            style={{
              margin: 0,
              fontSize: 16,
              color: "#333",
            }}
          >
            Contacts
          </Title>

          {Array.isArray(ad.contacts) && ad.contacts.length > 0 ? (
            ad.contacts.map((phone, index) => (
              <div
                key={index}
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <PhoneOutlined style={{ color: "#007bff" }} />
                <Text style={{ fontSize: 14, color: "#333" }}>
                  <strong>{phone.name}:</strong>{" "}
                  <a
                    href={`tel:${phone.number}`}
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    {phone.number}
                  </a>
                </Text>
              </div>
            ))
          ) : (
            <Text style={{ fontSize: 14, color: "#999" }}>
              No contacts available
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdCard;
