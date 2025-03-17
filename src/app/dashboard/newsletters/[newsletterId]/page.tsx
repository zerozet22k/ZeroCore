"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Result, Button } from "antd";
import NewsletterForm from "@/components/forms/NewsletterForm";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";

const EditNewsletterPage: React.FC = () => {
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const newsletterId = params?.newsletterId;

  useEffect(() => {
    if (newsletterId) {
      const fetchNewsletter = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.get(`/newsletters/${newsletterId}`);
          if (response.status === 200) {
            setNewsletter(response.data);
          } else {
            setError("Failed to fetch newsletter details.");
          }
        } catch (error) {
          console.error("Error fetching newsletter:", error);
          setError("An error occurred while fetching newsletter details.");
        } finally {
          setLoading(false);
        }
      };

      fetchNewsletter();
    } else {
      setError("Invalid newsletter ID.");
      setLoading(false);
    }
  }, [newsletterId]);

  return (
    <>
      {loading ? (
        <SubLoader tip="Loading newsletter details..." />
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="error"
              title="Error"
              subTitle={error}
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/newsletters")}
                >
                  Back to Newsletters
                </Button>
              }
            />
          </Card>
        </div>
      ) : newsletter ? (
        <NewsletterForm newsletter={newsletter} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="warning"
              title="No Newsletter Found"
              subTitle="The newsletter does not exist or has been removed."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/newsletters")}
                >
                  Back to Newsletters
                </Button>
              }
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default EditNewsletterPage;
