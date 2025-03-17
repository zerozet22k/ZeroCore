import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { getTranslatedText, LanguageJson } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";

const { Title, Text } = Typography;

// Define the individual card type
export type InfoCardProps = {
  title: LanguageJson;
  description: LanguageJson;
  images: { imageUrl: string }[];
  maxHeight?: number;
};

// Update InfoCardsProps to use full width cards
type InfoCardsProps = {
  cards: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.CARDS];
};

const InfoCards: React.FC<InfoCardsProps> = ({ cards }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      {cards.map((card, index) => (
        <DynamicInfoCard key={index} {...card} delay={index * 500} />
      ))}
    </div>
  );
};

type DynamicInfoCardProps = InfoCardProps & { delay: number };

const DynamicInfoCard: React.FC<DynamicInfoCardProps> = ({
  title,
  description,
  images,
  maxHeight = 350,
  delay,
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Only enable fade if there is more than 1 image.
  const [fade, setFade] = useState(images.length > 1 ? true : true);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFade(true);
        }, 600);
      }, 4000 + delay);
      return () => clearInterval(interval);
    }
  }, [images, delay]);

  return (
    <div
      style={{
        width: "100%",
        height: maxHeight,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${images[currentIndex].imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: images.length > 1 ? "opacity 0.6s ease" : "none",
          opacity: fade ? 1 : 0,
        }}
      />
      {/* Dark overlay for contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
        }}
      />
      {/* Glassmorphism Text Container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "20px 30px",
          borderRadius: 8,
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
          color: "white",
          maxWidth: "80%",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          {getTranslatedText(title, language)}
        </Title>
        <Text style={{ color: "white", fontSize: 16 }}>
          {getTranslatedText(description, language)}
        </Text>
      </div>
    </div>
  );
};

export default InfoCards;
