"use client";

import React from "react";
import { Typography, Spin, Alert } from "antd";
import ImageComponent from "@/components/ImageComponent";
import apiClient from "@/utils/api/apiClient";
import CustomCarousel from "@/components/CustomCarousel";
import {
  TEAM_PAGE_SETTINGS_KEYS,
  TEAM_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/TEAM_PAGE_SETTINGS";

const { Title, Text } = Typography;

interface TeamMember {
  id: number;
  name: string;
  bio: string;
  avatar: string;
}

type TeamSectionProps = {
  teamSection: TEAM_PAGE_SETTINGS_TYPES[typeof TEAM_PAGE_SETTINGS_KEYS.TEAM_SECTION];
};

const TeamSection: React.FC<TeamSectionProps> = ({ teamSection }) => {
  const maxMembersCount = teamSection?.maxMembersCount || 5;

  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await apiClient.get<TeamMember[]>("/team");
        if (response.data && Array.isArray(response.data)) {
          setTeamMembers(response.data.slice(0, maxMembersCount));
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch team members:", err);
        setError("Unable to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [maxMembersCount]);

  if (!loading && !error && teamMembers.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: "40px",
        }}
      >
        Meet Our Team
      </Title>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin size="large" tip="Loading team members..." />
        </div>
      )}

      {error && (
        <div style={{ padding: "60px 20px" }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      )}

      {teamMembers.length > 0 && (
        <div style={{ margin: "0 auto" }}>
          <CustomCarousel autoplay slidesToShow={3} dots infinite>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                  margin: "0 auto",
                  height: "300px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ImageComponent
                    src={member.avatar}
                    alt={member.name}
                    width={120}
                    height={120}
                    objectFit="cover"
                    style={{
                      borderRadius: "50%",
                      border: "4px solid #1890ff",
                      marginBottom: "10px",
                    }}
                    priority
                  />
                  <Title
                    level={4}
                    style={{
                      color: "white",
                      margin: "10px 0 5px",
                    }}
                  >
                    {member.name}
                  </Title>
                  <Text style={{ color: "white", fontSize: "14px" }}>
                    {member.bio}
                  </Text>
                </div>
              </div>
            ))}
          </CustomCarousel>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
