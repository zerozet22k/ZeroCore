import React, { useEffect, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";

interface Props<T> {
  type: string;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  selected?: string[];
  onChange?: (value: string) => void;
}

const PublicAPIDynamicDropdown = <T extends Record<string, any>>({
  type,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  disabled = false,
  value,
  selected = [],
  onChange,
}: Props<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = useCallback(
    async (searchQuery = "", currentPage = 1) => {
      if (!hasMore && currentPage !== 1) return;

      setLoading(true);
      try {
        const response = await apiClient.post(`/data`, {
          type,
          searchQuery,
          page: currentPage,
          limit: 10,
          selected,
        });

        setData((prev) =>
          currentPage === 1
            ? response.data.items
            : [...prev, ...response.data.items]
        );

        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    },
    [type, hasMore, selected]
  );

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
    fetchData(value, 1);
  }, 500);

  useEffect(() => {
    fetchData(search, page);
  }, [page]);

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      optionFilterProp="children"
      disabled={disabled}
      notFoundContent={loading ? <Spin size="small" /> : "No options found"}
      filterOption={false}
      onSearch={handleSearch}
      style={{ width: "100%" }}
    >
      {data.map((item) => (
        <Select.Option
          key={item[valueKey] as string}
          value={item[valueKey] as string}
        >
          {item[labelKey] as string}
        </Select.Option>
      ))}
    </Select>
  );
};

export default PublicAPIDynamicDropdown;
