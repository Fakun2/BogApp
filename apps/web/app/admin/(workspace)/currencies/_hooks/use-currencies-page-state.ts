"use client";

import { useState } from "react";
import type {
  CurrencySortDirection,
  CurrencySortKey,
  CurrencyStatusFilter
} from "../_types/currencies.types";

export function useCurrenciesPageState() {
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<CurrencySortKey>("name");
  const [sortDirection, setSortDirection] = useState<CurrencySortDirection>("asc");
  const [status, setStatus] = useState<CurrencyStatusFilter>("all");

  function resetPagination() {
    setCursor(null);
    setCursorStack([]);
    setPageIndex(0);
  }

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    resetPagination();
  }

  function updateStatus(nextStatus: CurrencyStatusFilter) {
    setStatus(nextStatus);
    resetPagination();
  }

  function sortBy(key: CurrencySortKey) {
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
    canPreviousPage: cursorStack.length > 0,
    cursor,
    pageIndex,
    search,
    sortDirection,
    sortKey,
    status,
    nextPage,
    previousPage,
    resetPagination,
    sortBy,
    updateSearch,
    updateStatus
  };
}
