"use client";
import React, { useEffect, useState, useCallback, CSSProperties } from "react";
import { Select, Spin } from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";
import { defaultSelectStyle, defaultWrapperStyle } from "../../InputStyle";

interface RoleSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

interface Role {
  _id: string;
  name: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a role",
  disabled = false,
  style = {},
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchRoles = useCallback(
    async (searchQuery = "", currentPage = 1) => {
      // Avoid fetching additional pages if no more data
      if (!hasMore && currentPage !== 1) return;

      setLoading(true);
      try {
        const response = await apiClient.post(`/data`, {
          type: "roles",
          searchQuery,
          page: currentPage,
          limit: 10,
        });

        setRoles((prev) =>
          currentPage === 1
            ? response.data.items
            : [...prev, ...response.data.items]
        );

        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore]
  );

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
    fetchRoles(value, 1);
  }, 500);

  useEffect(() => {
    // Fetch roles when page or search changes
    fetchRoles(search, page);
  }, [page, search, fetchRoles]);

  // Handler for infinite scrolling in the dropdown
  const handlePopupScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div style={{ ...defaultWrapperStyle, ...style }}>
      <Select
        showSearch
        loading={loading}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        optionFilterProp="children"
        disabled={disabled}
        notFoundContent={loading ? <Spin size="small" /> : "No roles found"}
        filterOption={false}
        onSearch={handleSearch}
        onPopupScroll={handlePopupScroll}
        style={{ ...defaultSelectStyle }}
      >
        <Select.Option value="">Select a role</Select.Option>
        {roles.map((role) => (
          <Select.Option key={role._id} value={role._id}>
            {role.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default RoleSelector;
