"use client";

import {
  getCoreRowModel,
  type Row,
  type Table as ReactTable,
  type VisibilityState,
  useReactTable
} from "@tanstack/react-table";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import type {
  CurrencyDto,
  CurrencySortDirection,
  CurrencySortKey,
  TenantCurrencyListResponseDto
} from "../../../_types/currencies.types";
import { getCurrencyTableColumns } from "../cells/currency-table-columns";

type CurrencyTableContextValue = {
  currencies: CurrencyDto[];
  error: Error | null;
  hasState: boolean;
  loading: boolean;
  pageIndex: number;
  pageInfo: TenantCurrencyListResponseDto["pageInfo"] | undefined;
  pageRows: Array<Row<CurrencyDto>>;
  table: ReactTable<CurrencyDto>;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
};

const CurrencyTableContext = createContext<CurrencyTableContextValue | null>(null);

export function CurrencyTableProvider({
  children,
  currencies,
  error,
  loading,
  pageIndex,
  pageInfo,
  sortDirection,
  sortKey,
  onNextPage,
  onPreviousPage,
  onSort
}: {
  children: ReactNode;
  currencies: CurrencyDto[];
  error: Error | null;
  loading: boolean;
  pageIndex: number;
  pageInfo: TenantCurrencyListResponseDto["pageInfo"] | undefined;
  sortDirection: CurrencySortDirection;
  sortKey: CurrencySortKey;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onSort: (key: CurrencySortKey) => void;
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const session = useSession();
  const canManageCurrencies = hasPermission(session, "finance:update");
  const columns = useMemo(
    () => getCurrencyTableColumns({ canManageCurrencies, sortDirection, sortKey, onSort }),
    [canManageCurrencies, sortDirection, sortKey, onSort]
  );
  const table = useReactTable({
    columns,
    data: currencies,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility }
  });
  const pageRows = table.getRowModel().rows;
  const hasState =
    (loading && currencies.length === 0) ||
    Boolean(error) ||
    (!loading && currencies.length === 0);

  const value = useMemo<CurrencyTableContextValue>(
    () => ({
      currencies,
      error,
      hasState,
      loading,
      pageIndex,
      pageInfo,
      pageRows,
      table,
      onNextPage,
      onPreviousPage
    }),
    [
      currencies,
      error,
      hasState,
      loading,
      pageIndex,
      pageInfo,
      pageRows,
      table,
      onNextPage,
      onPreviousPage
    ]
  );

  return <CurrencyTableContext.Provider value={value}>{children}</CurrencyTableContext.Provider>;
}

export function useCurrencyTableContext() {
  const context = useContext(CurrencyTableContext);

  if (!context) {
    throw new Error("useCurrencyTableContext must be used within CurrencyTableProvider.");
  }

  return context;
}
