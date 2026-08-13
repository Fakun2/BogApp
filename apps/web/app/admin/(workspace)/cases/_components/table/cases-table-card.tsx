"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { AdminTableHeader } from "../../../_components/admin-table-header";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
import { casesPageSize } from "../../_constants/cases.constants";
import { casesQueries } from "../../_api/cases.query-controller";
import type { CaseFiltersDraft } from "../../_types/case-filter.types";
import type {
  CasesListResponse,
  CasesQueryParams,
  CaseSortDirection,
  CaseSortKey,
  CasesTableColumn
} from "../../_types/cases.types";
import { appendCursor, getCurrentCursor, removeLastCursor } from "../../_utils/case-pagination";
import { getNextCaseSortDirection } from "../../_utils/case-sorting";
import { CasesPagination } from "./cases-pagination";
import { CasesTable } from "./cases-table";
import { CasesTableToolbar } from "./cases-table-toolbar";

export function CasesTableCard({
  canCreate,
  canDelete,
  canUpdate,
  casesData,
  columns,
  cursorStack,
  error,
  filters,
  sortBy,
  sortDirection
}: {
  canCreate: boolean;
  canDelete: boolean;
  canUpdate: boolean;
  casesData?: CasesListResponse;
  columns: CasesTableColumn[];
  cursorStack: string[];
  error: Error | null;
  filters: CaseFiltersDraft;
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
}) {
  const [localColumns, setLocalColumns] = useState(columns);
  const [localCursorStack, setLocalCursorStack] = useState(cursorStack);
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSortDirection, setLocalSortDirection] = useState(sortDirection);
  const queryParams = useMemo<CasesQueryParams>(
    () => ({
      cursor: getCurrentCursor(localCursorStack) ?? undefined,
      court: localFilters.court || undefined,
      filingDate: localFilters.filingDate || undefined,
      forumTemplateId: localFilters.forumTemplateId || undefined,
      instance:
        localFilters.instance === "first" ||
          localFilters.instance === "second" ||
          localFilters.instance === "third"
          ? localFilters.instance
          : undefined,
      judicialCenter: localFilters.judicialCenter || undefined,
      limit: casesPageSize,
      offset: localCursorStack.length * casesPageSize,
      provinceId: localFilters.provinceId || undefined,
      search: localFilters.search || undefined,
      status: localFilters.status || undefined,
      sortBy: localSortBy,
      sortDirection: localSortDirection
    }),
    [localCursorStack, localFilters, localSortBy, localSortDirection]
  );
  const querySpec = casesQueries.list(queryParams);
  const casesQuery = useDashboardQuery({
    ...querySpec,
    placeholderData: (previousData) => previousData ?? casesData
  });
  const tableData = casesQuery.data ?? casesData;
  const tableError = casesQuery.error ?? error;
  const pageInfo = tableData?.pageInfo;

  function handleFiltersChange(nextFilters: CaseFiltersDraft) {
    setLocalFilters(nextFilters);
    setLocalCursorStack([]);
  }

  function handleSort(nextSortBy: CaseSortKey) {
    setLocalSortDirection((currentDirection) =>
      getNextCaseSortDirection({
        active: localSortBy === nextSortBy,
        currentDirection
      })
    );
    setLocalSortBy(nextSortBy);
    setLocalCursorStack([]);
  }

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col gap-0 overflow-hidden border-0 py-0 shadow-[var(--admin-card-shadow)]`}
    >
      <AdminTableHeader
        actions={
          <CasesTableToolbar
            canCreate={canCreate}
            columns={localColumns}
            filters={localFilters}
            onColumnsChange={setLocalColumns}
            onFiltersChange={handleFiltersChange}
            onSort={handleSort}
            sortBy={localSortBy}
            sortDirection={localSortDirection}
          />
        }
        icon={BriefcaseBusiness}
        title="Expedientes"
      />
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-visible px-3 md:px-4 lg:overflow-hidden">
        <CasesTable
          canDelete={canDelete}
          canUpdate={canUpdate}
          columns={localColumns}
          error={tableError}
          onSort={handleSort}
          sortBy={localSortBy}
          sortDirection={localSortDirection}
          cases={tableData?.items ?? []}
        />
        <CasesPagination
          hasNextPage={pageInfo?.hasNextPage ?? false}
          nextCursor={pageInfo?.nextCursor ?? null}
          onNextPage={() => {
            if (pageInfo?.nextCursor) {
              setLocalCursorStack((currentStack) =>
                appendCursor(currentStack, pageInfo.nextCursor ?? "")
              );
            }
          }}
          onPreviousPage={() =>
            setLocalCursorStack((currentStack) => removeLastCursor(currentStack))
          }
          pageIndex={localCursorStack.length}
          pageRowsLength={tableData?.items.length ?? 0}
        />
      </CardContent>
    </Card>
  );
}
