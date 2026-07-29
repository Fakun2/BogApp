"use client";

import { useMemo, useState } from "react";
import { casesPageSize } from "../_constants/cases.constants";
import type { CasesQueryParams } from "../_types/cases.types";

export function useCasesPageState() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const queryParams = useMemo<CasesQueryParams>(
    () => ({
      limit: casesPageSize,
      offset,
      search: search || undefined,
      status: status || undefined,
      sortBy: "createdAt",
      sortDirection: "desc"
    }),
    [offset, search, status]
  );

  function updateSearch(value: string) {
    setSearch(value);
    setOffset(0);
  }

  function updateStatus(value: string) {
    setStatus(value);
    setOffset(0);
  }

  function nextPage() {
    setOffset((current) => current + casesPageSize);
  }

  function previousPage() {
    setOffset((current) => Math.max(0, current - casesPageSize));
  }

  function resetPagination() {
    setOffset(0);
  }

  return {
    nextPage,
    previousPage,
    queryParams,
    resetPagination,
    search,
    status,
    updateSearch,
    updateStatus
  };
}
