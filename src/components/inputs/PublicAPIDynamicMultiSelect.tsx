"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Select, Spin, Tag } from "antd";
import { debounce } from "lodash";
import apiClient from "@/utils/api/apiClient";

interface Props<T> {
  type: string;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  disabled?: boolean;
  value?: string[];
  initialValue?: string[];
  onChange?: (values: string[]) => void;
  filterOptions?: (option: T) => boolean;
  nonRemovableFilter?: (option: T) => boolean;
}

const PublicAPIDynamicMultiSelect = <T extends Record<string, any>>(
  props: Props<T>
) => {
  const {
    type,
    valueKey,
    labelKey,
    placeholder = "Select an option",
    disabled = false,
    initialValue,
    onChange,
    filterOptions,
    nonRemovableFilter,
  } = props;

  // Instead of using a default parameter (value = []),
  // extract the value and create a stable empty array if it’s undefined.
  const propValue = props.value;
  const stableValue = useMemo(() => propValue ?? [], [propValue]);

  const [data, setData] = useState<T[]>([]);
  const [persistedSelected, setPersistedSelected] = useState<T[]>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Memoize the controlled value.
  const selectedValue = useMemo(() => stableValue, [stableValue]);

  const fetchData = useCallback(
    async (searchQuery = "", currentPage = 1) => {
      if (loadingRef.current) return;
      if (!hasMoreRef.current && currentPage !== 1) return;
      if (!type) return;
      loadingRef.current = true;
      try {
        const response = await apiClient.post(`/data`, {
          type,
          searchQuery,
          page: currentPage,
          limit: 10,
          selected: selectedValue.length ? selectedValue : undefined,
        });
        const newData = response.data.items;
        setData((prev) =>
          currentPage === 1
            ? newData
            : [
                ...prev,
                ...newData.filter(
                  (item: any) => !prev.some((p) => p[valueKey] === item[valueKey])
                ),
              ]
        );
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        loadingRef.current = false;
        if (currentPage === 1) {
          setFirstLoad(false);
        }
      }
    },
    [type, valueKey, selectedValue]
  );

  useEffect(() => {
    async function fetchPersistedSelected() {
      const selectedIds =
        initialValue && initialValue.length > 0 ? initialValue : selectedValue;
      if (!selectedIds || selectedIds.length === 0) {
        setPersistedSelected([]);
        return;
      }
      try {
        const response = await apiClient.post(`/data`, {
          type,
          selected: selectedIds,
        });
        setPersistedSelected(response.data.items);
      } catch (error) {
        console.error("Error fetching persisted selected values:", error);
      }
    }
    fetchPersistedSelected();
  }, [initialValue, selectedValue, type]);

  const handleSearch = useCallback(
    debounce((searchValue: string) => {
      setSearch(searchValue);
      setPage(1);
    }, 800),
    []
  );

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      hasMore &&
      !loadingRef.current
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchData(search, page);
  }, [page, search, fetchData]);

  const mergedOptions = [
    ...persistedSelected,
    ...data.filter(
      (item) =>
        !persistedSelected.some((sel) => sel[valueKey] === item[valueKey])
    ),
  ].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t[valueKey] === item[valueKey])
  );

  const filteredOptions = mergedOptions.filter((item) => {
    const itemValue = item[valueKey] as string;
    if (
      selectedValue.includes(itemValue) ||
      (initialValue && initialValue.includes(itemValue))
    )
      return true;
    return filterOptions ? filterOptions(item) : true;
  });

  const tagRender = (props: any) => {
    const { label, value: tagValue, closable, onClose } = props;
    const option = mergedOptions.find((item) => item[valueKey] === tagValue);
    const isNonRemovable =
      option && nonRemovableFilter ? nonRemovableFilter(option) : false;
    return (
      <Tag
        closable={!isNonRemovable && closable}
        onClose={isNonRemovable ? undefined : onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  if (firstLoad && loadingRef.current) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Select
      mode="multiple"
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      disabled={disabled}
      value={selectedValue}
      onChange={onChange}
      tagRender={tagRender}
      notFoundContent={
        loadingRef.current ? <Spin size="small" /> : "No options found"
      }
      filterOption={false}
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      style={{ width: "100%" }}
      getPopupContainer={(triggerNode) =>
        triggerNode.parentNode as HTMLElement
      }
    >
      {filteredOptions.map((item) => (
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

export default PublicAPIDynamicMultiSelect;
