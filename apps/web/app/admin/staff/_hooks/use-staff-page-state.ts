"use client";

import { useMemo, useState } from "react";
import { initialStaffFilters } from "../_constants/staff.constants";
import type { StaffFilters, StaffSortDirection, StaffSortKey } from "../_types/staff.types";
import { hasStaffFilters } from "../_utils/staff-filters";

export function useStaffPageState() {
  const [draftFilters, setDraftFilters] = useState<StaffFilters>(initialStaffFilters);
  const [appliedFilters, setAppliedFilters] = useState<StaffFilters>(initialStaffFilters);
  const [sortKey, setSortKey] = useState<StaffSortKey>("lastName");
  const [sortDirection, setSortDirection] = useState<StaffSortDirection>("asc");
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const hasActiveFilters = useMemo(() => hasStaffFilters(appliedFilters), [appliedFilters]);
  const hasDraftFilters = useMemo(() => hasStaffFilters(draftFilters), [draftFilters]);

  function updateFilter<K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters() {
    setAppliedFilters(draftFilters);
    resetPagination();
  }

  function resetFilters() {
    setDraftFilters(initialStaffFilters);
    setAppliedFilters(initialStaffFilters);
    resetPagination();
  }

  function resetPagination() {
    setCursor(null);
    setCursorStack([]);
    setPageIndex(0);
  }

  function sortBy(key: StaffSortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      resetPagination();
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
    resetPagination();
  }

  function nextPage(nextCursor: string) {
    setCursorStack((current) => [...current, cursor]);
    setCursor(nextCursor);
    setPageIndex((current) => current + 1);
  }

  function previousPage() {
    setCursorStack((current) => {
      const previousCursor = current.at(-1) ?? null;
      setCursor(previousCursor);
      setPageIndex((currentPage) => Math.max(0, currentPage - 1));

      return current.slice(0, -1);
    });
  }

  return {
    appliedFilters,
    applyFilters,
    canPreviousPage: cursorStack.length > 0,
    cursor,
    draftFilters,
    hasActiveFilters,
    hasDraftFilters,
    nextPage,
    pageIndex,
    previousPage,
    resetFilters,
    resetPagination,
    sortBy,
    sortDirection,
    sortKey,
    updateFilter
  };
}
