"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Spin, Alert, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import { rgba } from "polished";
import PageWrapper from "@/components/PageWrapper";
import { getTranslatedText } from "@/utils/getTranslatedText";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/TEAM_PAGE_SETTINGS";
import { useLanguage } from "@/hooks/useLanguage";
import { UserAPI } from "@/models/UserModel";

type TeamContentProps = {
  data: TEAM_PAGE_SETTINGS_TYPES;
};

const TeamContent: React.FC<TeamContentProps> = ({ data }) => {
  const pageContent = data[TEAM_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const teamSection = data[TEAM_PAGE_SETTINGS_KEYS.TEAM_SECTION];

  const [teamMembers, setTeamMembers] = useState<UserAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = theme.useToken();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await apiClient.get<UserAPI[]>("/team");
        if (response.data && Array.isArray(response.data)) {
          // Limit the number of members based on the CMS setting
          const members = response.data.slice(0, teamSection.maxMembersCount);
          setTeamMembers(members);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [teamSection.maxMembersCount]);

  const glassBackground = rgba(token.colorBgContainer, 0.2);

  return (
    <PageWrapper pageContent={pageContent}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          color: token.colorTextBase,
        }}
      >
        {loading && (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        )}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "40px" }}
          />
        )}
        <Row gutter={[24, 24]} justify="center">
          {teamMembers.map((member) => (
            <Col xs={24} sm={12} md={8} lg={6} key={member._id}>
              <Link
                href={`/team-members/${member._id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s",
                    height: "100%",
                    backgroundColor: glassBackground,
                    backdropFilter: "blur(6px)",
                  }}
                  bodyStyle={{ padding: "20px" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <Avatar
                    size={96}
                    src={member.avatar}
                    icon={!member.avatar ? <UserOutlined /> : undefined}
                    style={{ margin: "0 auto", display: "block" }}
                  />
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h2
                      style={{
                        fontSize: "22px",
                        marginBottom: "8px",
                        color: "inherit",
                      }}
                    >
                      {member.name}
                    </h2>
                    <p
                      style={{
                        fontSize: "16px",
                        marginBottom: 0,
                        color: "inherit",
                      }}
                    >
                      {member.roles.map((role) => role.name).join(", ")}
                    </p>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </PageWrapper>
  );
};

export default TeamContent;
