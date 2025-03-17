"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  List,
  Input,
  Button,
  Spin,
  Alert,
  Typography,
  Divider,
  theme,
} from "antd";
import Link from "next/link";
import apiClient from "@/utils/api/apiClient";
import PageWrapper from "@/components/PageWrapper";
import { useLanguage } from "@/hooks/useLanguage";
import {
  NEWSLETTER_PAGE_SETTINGS_KEYS,
  NEWSLETTER_PAGE_SETTINGS_TYPES,
} from "@/config/CMS/pages/NEWSLETTER_PAGE_SETTINGS";
import { INewsletterAPI } from "@/models/Newsletter";

const { Title, Paragraph } = Typography;
const { Search } = Input;

type NewsletterContentProps = {
  data: NEWSLETTER_PAGE_SETTINGS_TYPES;
};

const NewsletterContent: React.FC<NewsletterContentProps> = ({ data }) => {
  const { language } = useLanguage();
  const pageContent = data[NEWSLETTER_PAGE_SETTINGS_KEYS.PAGE_CONTENT];
  const newsletterSection =
    data[NEWSLETTER_PAGE_SETTINGS_KEYS.NEWSLETTER_SECTION];

  const [newsletters, setNewsletters] = useState<INewsletterAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const { token } = theme.useToken();

  // Number of newsletters per page from CMS settings.
  const limit = newsletterSection.maxNewslettersCount;

  const fetchNewsletters = useCallback(
    async (reset: boolean = false) => {
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await apiClient.get(
          `/newsletters?search=${encodeURIComponent(
            searchText
          )}&page=${currentPage}&limit=${limit}`
        );
        if (
          response.status === 200 &&
          Array.isArray(response.data.newsletters)
        ) {
          const fetched = response.data.newsletters as INewsletterAPI[];
          setNewsletters((prev) => (reset ? fetched : [...prev, ...fetched]));
          setHasMore(response.data.hasMore);
          setPage(reset ? 2 : currentPage + 1);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching newsletters:", err);
        setError("Failed to load newsletters.");
      } finally {
        setLoading(false);
      }
    },
    [searchText, page, limit]
  );

  // Trigger a new search when the search text changes.
  useEffect(() => {
    fetchNewsletters(true);
  }, [searchText]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const loadMore = () => {
    fetchNewsletters();
  };

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
        <Search
          placeholder="Search newsletters..."
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: 24 }}
        />
        {loading && newsletters.length === 0 ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "40px" }}
          />
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={newsletters}
              renderItem={(newsletter: INewsletterAPI) => {
                const title =
                  typeof newsletter.title === "string"
                    ? newsletter.title
                    : newsletter.title.en || "Untitled";
                const excerpt = "Click to view newsletter details.";
                return (
                  <List.Item
                    style={{
                      padding: "16px 0",
                      borderBottom: `1px solid ${token.colorBorder}`,
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <Link href={`/newsletters/${newsletter._id}`}>
                          {title}
                        </Link>
                      }
                      description={excerpt}
                    />
                  </List.Item>
                );
              }}
            />
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Button type="primary" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
        <Divider style={{ marginTop: 40 }} />
        <Paragraph style={{ textAlign: "center" }}>
          {typeof pageContent.description === "string"
            ? pageContent.description
            : pageContent.description[language] || pageContent.description.en}
        </Paragraph>
      </div>
    </PageWrapper>
  );
};

export default NewsletterContent;
