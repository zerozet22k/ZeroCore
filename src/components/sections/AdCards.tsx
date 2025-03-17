import React from "react";
import { Row, Col, Divider } from "antd";
import AdCard from "./AdCard";
import {
  HOME_PAGE_SETTINGS_TYPES,
  HOME_PAGE_SETTINGS_KEYS,
} from "@/config/CMS/pages/HOME_PAGE_SETTINGS";

const AdCards: React.FC<{
  cards?: HOME_PAGE_SETTINGS_TYPES[typeof HOME_PAGE_SETTINGS_KEYS.ADS];
}> = ({ cards = [] }) => {
  return (
    <section style={{ padding: "40px 20px", backgroundColor: "#f7f7f7" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#333",
          }}
        >
          Related Businesses
        </h2>
        <Row gutter={[24, 24]} justify="center">
          {cards.length > 0 ? (
            cards.map((ad, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <AdCard ad={ad} />
              </Col>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                color: "gray",
                width: "100%",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No ads available.
            </div>
          )}
        </Row>
      </div>
    </section>
  );
};

export default AdCards;
