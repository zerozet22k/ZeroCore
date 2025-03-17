import { useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/api/apiClient";
import { FIREBASE_SETTINGS_KEYS } from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import { useUser } from "@/hooks/useUser";

export const useFirebaseConfig = () => {
  const { user, initialLoading: userInitialLoading } = useUser();
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  const fetchFirebaseConfig = async () => {
    // Only attempt to fetch settings if the user is logged in.
    if (!user) {
      setFirebaseLoading(false);
      setFirebaseReady(false);
      return;
    }
    try {
      setFirebaseLoading(true);
      const response = await apiClient.get(
        `/settings/key/${FIREBASE_SETTINGS_KEYS.FIREBASE}`
      );
      if (response.data?.serviceAccount) {
        setFirebaseReady(true);
      } else {
        throw new Error("Firebase settings are missing.");
      }
    } catch (error) {
      console.error("Error fetching Firebase settings:", error);
      setFirebaseReady(false);
    } finally {
      setFirebaseLoading(false);
    }
  };

  useEffect(() => {
    // Wait for the user state to settle before fetching.
    if (!userInitialLoading) {
      fetchFirebaseConfig();
    }
  }, [user, userInitialLoading]);

  const checkFirebaseConfig = useCallback(async () => {
    await fetchFirebaseConfig();
  }, [user]);

  return {
    firebaseLoading,
    firebaseReady,
    fetchFirebaseConfig,
    checkFirebaseConfig,
  };
};
