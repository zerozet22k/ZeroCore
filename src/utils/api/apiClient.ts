import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Extend AxiosRequestConfig with a custom _retryAttempt property.
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retryAttempt?: number;
}

const MAX_RETRIES = 3;

const saveTokens = (
  accessToken: string,
  refreshToken: string,
  accessTokenExpiry: number,
  refreshTokenExpiry: number
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessTokenExpiry", accessTokenExpiry.toString());
    localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry.toString());
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("deviceName");
    localStorage.removeItem("accessTokenExpiry");
    localStorage.removeItem("refreshTokenExpiry");
  }
};

const isTokenExpired = (): boolean => {
  const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");
  const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");

  const accessTokenExpiryParsed = accessTokenExpiry
    ? parseInt(accessTokenExpiry, 10)
    : null;
  const refreshTokenExpiryParsed = refreshTokenExpiry
    ? parseInt(refreshTokenExpiry, 10)
    : null;

  // Convert expiry from seconds to milliseconds before comparing.
  return (
    (accessTokenExpiryParsed !== null &&
      accessTokenExpiryParsed * 1000 < Date.now()) ||
    (refreshTokenExpiryParsed !== null &&
      refreshTokenExpiryParsed * 1000 < Date.now())
  );
};

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const deviceName = localStorage.getItem("deviceName");
    if (deviceName) {
      config.headers["Device-Name"] = deviceName;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Prevent retry loop: if the refresh endpoint itself fails, clear tokens.
    if (originalRequest.url === `${NEXT_PUBLIC_API_URL}/auth/refresh`) {
      clearTokens();
      return Promise.reject(error);
    }

    // If 401 error, try refreshing token (only up to MAX_RETRIES).
    if (error.response?.status === 401 && (originalRequest._retryAttempt || 0) < MAX_RETRIES) {
      originalRequest._retryAttempt = (originalRequest._retryAttempt || 0) + 1;

      const refreshToken = localStorage.getItem("refreshToken");
      const deviceName = localStorage.getItem("deviceName");

      if (!refreshToken || !localStorage.getItem("accessToken")) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint without triggering interceptors.
        const { data } = await axios.post(
          `${NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken, deviceName }
        );

        // Save new tokens and update the authorization header.
        saveTokens(data.accessToken, data.refreshToken, data.accessTokenExpiry, data.refreshTokenExpiry);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };

        // Return the retried request.
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // If maximum retries reached, clear tokens.
    if ((originalRequest._retryAttempt || 0) >= MAX_RETRIES) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export { saveTokens, clearTokens };
export default apiClient;
