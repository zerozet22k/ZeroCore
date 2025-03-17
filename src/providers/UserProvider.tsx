"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import useSWR from "swr";
import { message } from "antd";
import apiClient, { saveTokens, clearTokens } from "@/utils/api/apiClient";
import UserContext from "@/contexts/UserContext";
import { UserAPI } from "@/models/UserModel";

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserAPI | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasShownLogoutMessage, setHasShownLogoutMessage] = useState(false);

  // SWR fetcher suppresses logging 401 errors.
  const fetcher = useCallback(async (url: string) => {
    try {
      const res = await apiClient.get(url);
      return res.data;
    } catch (error: any) {
      if (!error.response || error.response.status !== 401) {
        console.error("Error fetching user data:", error);
      }
      return null;
    }
  }, []);

  const { data, mutate, isValidating } = useSWR<UserAPI>(
    () => (localStorage.getItem("accessToken") ? "/me" : null),
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    setUser(data || null);
    if (!isValidating) {
      setInitialLoading(false);
    }
  }, [data, isValidating]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (
        !localStorage.getItem("accessToken") ||
        !localStorage.getItem("refreshToken")
      ) {
        if (user) {
          logout("Logged out due to session change.");
        }
      } else {
        mutate();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, mutate]);

  const getBrowserName = () => {
    const userAgent = navigator.userAgent || "Unknown Device";
    let browserName = "Unknown Device";
    if (
      userAgent.includes("Chrome") &&
      userAgent.includes("Safari") &&
      !userAgent.includes("Edge") &&
      !userAgent.includes("OPR")
    ) {
      browserName = "Chrome";
    } else if (userAgent.includes("Edg")) {
      browserName = "Edge";
    } else if (userAgent.includes("OPR")) {
      browserName = "Opera";
    } else if (userAgent.includes("Firefox")) {
      browserName = "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari";
    }
    localStorage.setItem("deviceName", browserName);
    return browserName;
  };

  useEffect(() => {
    if (!localStorage.getItem("deviceName")) {
      getBrowserName();
    }
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error?.response?.data?.message || defaultMessage;
    message.error(errorMessage);
  }, []);

  const refreshUser = useCallback(() => {
    mutate();
  }, [mutate]);

  const awaitRefreshUser = useCallback(async () => {
    try {
      await mutate();
    } catch (error) {
      handleError(error, "Failed to refresh user data.");
    }
  }, [mutate, handleError]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        let deviceName = localStorage.getItem("deviceName");
        if (!deviceName) {
          deviceName = getBrowserName();
        }
        const { data } = await apiClient.post("/auth/login", {
          email,
          password,
          deviceName,
        });
        const {
          user: apiUser,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        } = data;
        const accessTokenExpiry = Date.now() + accessTokenExpiresIn * 1000;
        const refreshTokenExpiry = Date.now() + refreshTokenExpiresIn * 1000;

        saveTokens(
          accessToken,
          refreshToken,
          accessTokenExpiry,
          refreshTokenExpiry
        );
        setUser(apiUser);
        setHasShownLogoutMessage(false);
        await mutate();
        message.success("Login successful!");
      } catch (error) {
        handleError(error, "Invalid email or password.");
        throw error;
      }
    },
    [mutate, handleError]
  );

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const { data } = await apiClient.post("/auth/signup", {
          username,
          email,
          password,
        });
        const {
          user: apiUser,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        } = data;
        const accessTokenExpiry = Date.now() + accessTokenExpiresIn * 1000;
        const refreshTokenExpiry = Date.now() + refreshTokenExpiresIn * 1000;

        saveTokens(
          accessToken,
          refreshToken,
          accessTokenExpiry,
          refreshTokenExpiry
        );
        setUser(apiUser);
        setHasShownLogoutMessage(false);
        await mutate();
        message.success("Signup successful!");
      } catch (error) {
        handleError(error, "Signup failed. Please try again.");
        throw error;
      }
    },
    [mutate, handleError]
  );

  const logout = useCallback(
    async (infoMessage?: string | React.SyntheticEvent) => {
      const finalMessage =
        typeof infoMessage === "string" ? infoMessage : "Logging out";
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const deviceName = localStorage.getItem("deviceName");

        if (!hasShownLogoutMessage) {
          message.info(finalMessage);
          setHasShownLogoutMessage(true);
        }
        const logoutPromise =
          refreshToken && deviceName
            ? apiClient.post("/auth/logout", { refreshToken, deviceName })
            : Promise.resolve();

        clearTokens();
        setUser(null);
        mutate(undefined, false);
        await logoutPromise;
        localStorage.removeItem("deviceName");
      } catch (error) {
        console.error("Unexpected error during logout:", error);
        message.error("Logout failed!");
      }
    },
    [mutate, hasShownLogoutMessage]
  );

  // We use only SWR's loading states.
  const loading = initialLoading || isValidating;

  const value = useMemo(
    () => ({
      user,
      initialLoading,
      loading,
      refreshUser,
      awaitRefreshUser,
      signIn,
      signUp,
      logout,
    }),
    [
      user,
      initialLoading,
      loading,
      refreshUser,
      awaitRefreshUser,
      signIn,
      signUp,
      logout,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
