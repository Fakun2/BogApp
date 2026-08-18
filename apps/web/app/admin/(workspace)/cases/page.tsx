import { Suspense } from "react";
import { hasPermission } from "@/lib/auth/permissions";
import { RestrictedCases } from "./_components/access/restricted-cases";
import { AdminMetricsSkeletonGrid } from "../_components/admin-skeletons";
import { CaseMetrics } from "./_components/metrics/case-metrics";
import { CasesTableCard } from "./_components/table/cases-table-card";
import { CasesTableSkeleton } from "./_components/table/cases-table-skeleton";
import { casesPageSize } from "./_constants/cases.constants";
import {
  getCaseMetricsServer,
  getCasesServerSession,
  listCasesServer
} from "./_api/cases.server-api";
import type { CasesPageSearchParams, CasesQueryParams } from "./_types/cases.types";
import { getCurrentCursor, parseCursorStack } from "./_utils/case-pagination";
import { emptyCaseFilters } from "./_utils/case-filter-options";
import { parseCaseSortDirection, parseCaseSortKey } from "./_utils/case-sorting";
import { parseCasesTableColumns } from "./_utils/case-table-columns";

export default async function CasesPage({
  searchParams
}: {
  searchParams?: Promise<CasesPageSearchParams>;
}) {
  const session = await getCasesServerSession();

  if (!session || !hasPermission(session, "cases:read")) {
    return <RestrictedCases />;
  }

  const params = (await searchParams) ?? {};
  const suspenseKey = JSON.stringify(params);

  return (
    <Suspense fallback={<CasesPageSkeleton />} key={suspenseKey}>
      <CasesPageContent params={params} session={session} />
    </Suspense>
  );
}

async function CasesPageContent({
  params,
  session
}: {
  params: CasesPageSearchParams;
  session: NonNullable<Awaited<ReturnType<typeof getCasesServerSession>>>;
}) {
  const cursorStack = parseCursorStack(params.cursorStack);
  const sortBy = parseCaseSortKey(params.sortBy);
  const sortDirection = parseCaseSortDirection(params.sortDirection);
  const queryParams: CasesQueryParams = {
    cursor: getCurrentCursor(cursorStack) ?? params.cursor,
    court: params.court || undefined,
    filingDate: params.filingDate || undefined,
    forumTemplateId: params.forumTemplateId || undefined,
    instance:
      params.instance === "first" || params.instance === "second" || params.instance === "third"
        ? params.instance
        : undefined,
    judicialCenter: params.judicialCenter || undefined,
    limit: casesPageSize,
    offset: cursorStack.length * casesPageSize,
    provinceId: params.provinceId || undefined,
    search: params.search || undefined,
    status: params.status || undefined,
    sortBy,
    sortDirection
  };
  const columns = parseCasesTableColumns(params.columns);
  const { casesResult, metrics } = await loadCasesPage(queryParams);

  return (
    <div className="flex h-[calc(100svh-104px)] min-h-0 flex-col gap-3 overflow-hidden md:h-[calc(100svh-112px)] md:gap-4">
      <CaseMetrics metrics={metrics} />
      <CasesTableCard
        canCreate={hasPermission(session, "cases:create")}
        canDelete={hasPermission(session, "cases:delete")}
        canUpdate={hasPermission(session, "cases:update")}
        casesData={casesResult.data}
        columns={columns}
        cursorStack={cursorStack}
        error={casesResult.error}
        filters={{
          ...emptyCaseFilters,
          court: params.court ?? "",
          filingDate: params.filingDate ?? "",
          forumTemplateId: params.forumTemplateId ?? "",
          instance: params.instance ?? "",
          judicialCenter: params.judicialCenter ?? "",
          provinceId: params.provinceId ?? "",
          search: params.search ?? "",
          status: params.status ?? ""
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
      />
    </div>
  );
}

async function loadCasesPage(params: CasesQueryParams) {
  const [casesResult, metricsResult] = await Promise.allSettled([
    listCasesServer(params),
    getCaseMetricsServer()
  ]);

  return {
    casesResult:
      casesResult.status === "fulfilled"
        ? { data: casesResult.value, error: null }
        : {
            data: undefined,
            error:
              casesResult.reason instanceof Error
                ? casesResult.reason
                : new Error("No se pudieron cargar los expedientes.")
          },
    metrics:
      metricsResult.status === "fulfilled"
        ? metricsResult.value
        : { totalCases: 0, openCases: 0, closedCases: 0, pendingTasks: 0 }
  };
}

function CasesPageSkeleton() {
  return (
    <div className="flex h-[calc(100svh-104px)] min-h-0 flex-col gap-3 overflow-hidden md:h-[calc(100svh-112px)] md:gap-4">
      <AdminMetricsSkeletonGrid />
      <CasesTableSkeleton />
    </div>
  );
}
