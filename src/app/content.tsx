"use client";

import React from "react";
import { Layout, Card, Row, Col, Typography } from "antd";
import HeroSlider from "@/components/HeroSlider";
import FAQSection from "@/components/FAQSection";
import InfoCards from "@/components/sections/InfoCards";
import AdCards from "@/components/sections/AdCards";
import {
  HOME_PAGE_SETTINGS_KEYS,
  HOME_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";
import SendMailForm from "@/components/SendMailForm";
import Testimonials from "@/components/sections/Testimonials";

const { Content } = Layout;
const { Title, Text } = Typography;

type HomePageContentProps = {
  data: HOME_PAGE_SETTINGS_TYPES;
};

const HomePageContent: React.FC<HomePageContentProps> = ({ data }) => {
  const heroSlides = data[HOME_PAGE_SETTINGS_KEYS.HERO_BANNER] || [];

  const faqs = data[HOME_PAGE_SETTINGS_KEYS.FAQS] || [];
  const ads = data[HOME_PAGE_SETTINGS_KEYS.ADS] || [];
  const infoCards = data[HOME_PAGE_SETTINGS_KEYS.CARDS] || [];
  const testimonials = data[HOME_PAGE_SETTINGS_KEYS.TESTIMONIALS] || [];
  return (
    <Layout style={{ width: "100%", maxWidth: "100%", padding: "0px" }}>
      <Content style={{ margin: 0, minHeight: 380 }}>
        <HeroSlider slides={heroSlides} delay={5000} />
        <div style={{ width: "100%" }}>
          <InfoCards cards={infoCards} />
          <AdCards cards={ads} />
          <Row
            gutter={[16, 16]}
            justify="center"
            style={{ width: "100%", margin: "0 auto" }}
          >
            <Col xs={24} lg={12}>
              <FAQSection faqs={faqs} />
            </Col>
            <Col sm={24} lg={12}>
              <Card title="Lin Myanmar News Letters">
                <Text>{`Latest updates on Myanmar's legal landscape.`}</Text>
              </Card>
            </Col>
          </Row>
          <Testimonials testimonials={testimonials} />
          <div style={{ width: "100%" }}>
            <SendMailForm />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePageContent;
