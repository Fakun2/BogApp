"use client";

import {
  getCoreRowModel,
  type Row,
  type RowSelectionState,
  type Table as ReactTable,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  StaffListResponse,
  StaffSortDirection,
  StaffSortKey,
  StaffWorker,
} from "../../../_types/staff.types";
import { getStaffTableColumns } from "../cells/staff-table-columns";

type StaffTableContextValue = {
  error: Error | null;
  hasState: boolean;
  loading: boolean;
  pageIndex: number;
  pageInfo: StaffListResponse["pageInfo"] | undefined;
  pageRows: Array<Row<StaffWorker>>;
  staffData: StaffListResponse | undefined;
  table: ReactTable<StaffWorker>;
  workers: StaffWorker[];
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
};

const StaffTableContext = createContext<StaffTableContextValue | null>(null);

export function StaffTableProvider({
  children,
  error,
  loading,
  pageIndex,
  pageInfo,
  sortDirection,
  sortKey,
  staffData,
  workers,
  onNextPage,
  onPreviousPage,
  onSort,
  onStaffCreated,
}: {
  children: ReactNode;
  error: Error | null;
  loading: boolean;
  pageIndex: number;
  pageInfo: StaffListResponse["pageInfo"] | undefined;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  workers: StaffWorker[];
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onSort: (key: StaffSortKey) => void;
  onStaffCreated: () => void;
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useMemo(
    () =>
      getStaffTableColumns({
        onStaffUpdated: onStaffCreated,
        sortDirection,
        sortKey,
        staffData,
        onSort,
      }),
    [onStaffCreated, sortDirection, sortKey, staffData, onSort],
  );
  const table = useReactTable({
    columns,
    data: workers,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });
  const pageRows = table.getRowModel().rows;
  const hasState =
    (loading && workers.length === 0) ||
    Boolean(error) ||
    (!loading && workers.length === 0);

  const value = useMemo<StaffTableContextValue>(
    () => ({
      error,
      hasState,
      loading,
      pageIndex,
      pageInfo,
      pageRows,
      staffData,
      table,
      workers,
      onNextPage,
      onPreviousPage,
    }),
    [
      columnVisibility,
      error,
      hasState,
      loading,
      pageIndex,
      pageInfo,
      pageRows,
      rowSelection,
      staffData,
      table,
      workers,
      onNextPage,
      onPreviousPage,
    ],
  );

  return <StaffTableContext.Provider value={value}>{children}</StaffTableContext.Provider>;
}

export function useStaffTableContext() {
  const context = useContext(StaffTableContext);

  if (!context) {
    throw new Error("useStaffTableContext must be used within StaffTableProvider.");
  }

  return context;
}
