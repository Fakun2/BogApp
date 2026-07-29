import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../../../_constants/dashboard";
import type { CaseFiltersDraft } from "../../_types/case-filter.types";
import type {
  CasesListResponse,
  CaseSortDirection,
  CaseSortKey,
  CasesTableColumn
} from "../../_types/cases.types";
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
  sortDirection,
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
  const pageInfo = casesData?.pageInfo;

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardHeader className="flex shrink-0 flex-col gap-3 border-b border-border/30 px-4 py-4 md:gap-4 md:px-6 md:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <CardTitle className={`text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
            Expedientes
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona causas del estudio con provincia, fuero y datos judiciales basicos.
          </p>
        </div>
        <CasesTableToolbar
          canCreate={canCreate}
          columns={columns}
          filters={filters}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
        <CasesTable
          canDelete={canDelete}
          canUpdate={canUpdate}
          columns={columns}
          error={error}
          sortBy={sortBy}
          sortDirection={sortDirection}
          cases={casesData?.items ?? []}
        />
        <CasesPagination
          cursorStack={cursorStack}
          hasNextPage={pageInfo?.hasNextPage ?? false}
          nextCursor={pageInfo?.nextCursor ?? null}
          pageIndex={cursorStack.length}
          pageRowsLength={casesData?.items.length ?? 0}
        />
      </CardContent>
    </Card>
  );
}
