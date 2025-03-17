"use client";

import React, { useState } from "react";
import { Layout, Drawer, Typography, theme } from "antd";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useSettings } from "@/hooks/useSettings";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import UserAvatar from "../components/UserAvatar";
import { GLOBAL_SETTINGS_KEYS } from "@/config/CMS/settings/keys/GLOBAL_SETTINGS_KEYS";
import AppMenu from "@/config/navigations/navigationMenu";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);

  const siteSettings: SettingsInterface[typeof GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] =
    settings?.[GLOBAL_SETTINGS_KEYS.SITE_SETTINGS] || {
      siteName: "",
      siteUrl: "",
      siteBanner: "",
      siteLogo: "",
    };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const siteLogo = siteSettings.siteLogo?.trim() || "/images/logo.svg";
  const siteName = siteSettings.siteName?.trim() || "Site Logo";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          placement="right"
          closable={false}
          styles={{ body: { padding: 0, background: colorBgContainer } }}
          onClose={handleDrawerToggle}
          open={drawerVisible}
          width={220}
        >
          <div
            className="logo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link href="/">
              <img
                src={siteLogo}
                alt={siteName}
                style={{ width: "100%", objectFit: "contain" }}
              />
            </Link>
          </div>
          <AppMenu
            menuMode="inline"
            isDashboard={true}
            isMobile={true}
            onMenuClick={handleDrawerToggle}
          />
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          collapsedWidth={80}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            background: colorBgContainer,
          }}
        >
          <div
            className="logo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link href="/">
              <img
                src={siteLogo}
                alt={siteName}
                style={{
                  width: "100%",
                  padding: "20px0",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>
          <AppMenu
            menuMode="inline"
            isDashboard={true}
            isMobile={false}
            onMenuClick={handleDrawerToggle}
          />
        </Sider>
      )}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 220,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Header
          style={{
            padding: isMobile ? "0 12px" : "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
            background: colorBgContainer,
            height: "84px",
          }}
        >
          <div>

          </div>
          {/* <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginRight: "auto",
            }}
          >
            {siteName}
          </Text> */}
          <UserAvatar isMobile={isMobile} toggleDrawer={handleDrawerToggle} />
        </Header>

        <Content
          style={{
            padding: isMobile ? "12px" : "24px",
            minHeight: "calc(100vh - 134px)",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center", padding: "12px 24px" }}>
          <Text>
            {siteName} © {new Date().getFullYear()} All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
