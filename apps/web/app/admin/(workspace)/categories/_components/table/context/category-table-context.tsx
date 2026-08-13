"use client";

import {
  getCoreRowModel,
  type Row,
  type Table as ReactTable,
  type VisibilityState,
  useReactTable
} from "@tanstack/react-table";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  CategoryDto,
  CategoryListResponseDto,
  CategorySortDirection,
  CategorySortKey
} from "../../../_types/categories.types";
import { getCategoryTableColumns } from "../cells/category-table-columns";

type CategoryTableContextValue = {
  categories: CategoryDto[];
  error: Error | null;
  hasState: boolean;
  loading: boolean;
  pageIndex: number;
  pageInfo: CategoryListResponseDto["pageInfo"] | undefined;
  pageRows: Array<Row<CategoryDto>>;
  table: ReactTable<CategoryDto>;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
};

const CategoryTableContext = createContext<CategoryTableContextValue | null>(null);

export function CategoryTableProvider({
  categories,
  children,
  error,
  loading,
  pageIndex,
  pageInfo,
  sortDirection,
  sortKey,
  onMutationSuccess,
  onNextPage,
  onPreviousPage,
  onSort
}: {
  categories: CategoryDto[];
  children: ReactNode;
  error: Error | null;
  loading: boolean;
  pageIndex: number;
  pageInfo: CategoryListResponseDto["pageInfo"] | undefined;
  sortDirection: CategorySortDirection;
  sortKey: CategorySortKey;
  onMutationSuccess: () => void;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
  onSort: (key: CategorySortKey) => void;
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useMemo(
    () => getCategoryTableColumns({ sortDirection, sortKey, onMutationSuccess, onSort }),
    [sortDirection, sortKey, onMutationSuccess, onSort]
  );
  const table = useReactTable({
    columns,
    data: categories,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility }
  });
  const pageRows = table.getRowModel().rows;
  const hasState =
    (loading && categories.length === 0) ||
    Boolean(error) ||
    (!loading && categories.length === 0);

  const value = useMemo<CategoryTableContextValue>(
    () => ({
      categories,
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
      categories,
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

  return <CategoryTableContext.Provider value={value}>{children}</CategoryTableContext.Provider>;
}

export function useCategoryTableContext() {
  const context = useContext(CategoryTableContext);

  if (!context) {
    throw new Error("useCategoryTableContext must be used within CategoryTableProvider.");
  }

  return context;
}
