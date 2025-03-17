import { useState, useCallback, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import apiClient from "@/utils/api/apiClient";
import { FileDataAPI } from "@/models/FileModel";
import { SearchState } from "@/contexts/FileContext";
import { message } from "antd";
import { useUser } from "@/hooks/useUser";

export const useFetchFiles = () => {
  const { user, initialLoading: userInitialLoading } = useUser();

  const [files, setFiles] = useState<FileDataAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>({
    search: "",
    page: 1,
    type: "",
  });

  useEffect(() => {
    if (userInitialLoading) return;
    if (!user) {
      setFiles([]);
      return;
    }
    fetchFiles(searchState);
  }, [user, userInitialLoading]);

  const debouncedFetchFiles = useMemo(
    () =>
      debounce((searchStateData: SearchState) => {
        void fetchFilesInternal(searchStateData);
      }, 300),
    []
  );

  const fetchFiles = useCallback(
    (searchStateData: SearchState) => {
      if (!user) return;
      setLoading(true);
      setSearchState(searchStateData);

      if (searchStateData.page === 1) {
        setHasMore(true);
      }

      debouncedFetchFiles(searchStateData);
    },
    [debouncedFetchFiles, user]
  );

  const fetchFilesInternal = async (searchStateData: SearchState) => {
    try {
      const response = await apiClient.post("/data", {
        type: "files",
        searchQuery: searchStateData.search,
        fileType: searchStateData.type,
        page: searchStateData.page,
        limit: 12,
      });
      setFiles((prev) =>
        searchStateData.page === 1
          ? response.data.items
          : [...prev, ...response.data.items]
      );
      setHasMore(response.data.hasMore);
    } catch (error) {
      message.error("Failed to fetch files.");
      console.error("fetchFilesInternal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = useCallback(() => {
    setFiles([]);
    setHasMore(true);
    setSearchState({ search: "", page: 1, type: "" });
  }, []);

  const deleteFile = useCallback(async (fileIds: string[]) => {
    try {
      await Promise.all(
        fileIds.map((fileId) => apiClient.delete(`/files/${fileId}`))
      );
      setFiles((prev) => prev.filter((file) => !fileIds.includes(file._id)));
      message.success(`Deleted ${fileIds.length} file(s) successfully.`);
    } catch (error) {
      message.error("Failed to delete files.");
      console.error("deleteFile error:", error);
    }
  }, []);

  const syncFiles = useCallback(async () => {
    if (!user) return;
    setSyncing(true);
    try {
      await apiClient.post("/files/sync");
      fetchFiles({ ...searchState, page: 1 });
      message.success("Files synced successfully.");
    } catch (error) {
      message.error("Failed to sync files.");
      console.error("syncFiles error:", error);
    } finally {
      setSyncing(false);
    }
  }, [searchState, fetchFiles, user]);

  return {
    files,
    setFiles,
    loading,
    syncing,
    hasMore,
    searchState,
    fetchFiles,
    clearFiles,
    deleteFile,
    syncFiles,
  };
};
