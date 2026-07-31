import { BriefcaseBusiness } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminTableHeader } from "../../../_components/admin-table-header";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
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
      <AdminTableHeader
        actions={
          <CasesTableToolbar
            canCreate={canCreate}
            columns={columns}
            filters={filters}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        }
        icon={BriefcaseBusiness}
        title="Expedientes"
      />
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
