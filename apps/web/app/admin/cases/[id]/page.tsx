import { hasPermission } from "@/lib/auth/permissions";
import { RestrictedCases } from "../_components/access/restricted-cases";
import { CaseCalendarCard } from "../_components/detail/case-calendar";
import { CaseDetailSummary } from "../_components/detail/case-detail-summary";
import { CaseExpensesBreakdownCard } from "../_components/detail/paid-expenses-breakdown";
import { CaseTasksTable } from "../_components/detail/tasks-table";
import { getCaseDetailServer, getCasesServerSession } from "../_api/cases.server-api";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCasesServerSession();

  if (!session || !hasPermission(session, "cases:read")) {
    return <RestrictedCases />;
  }

  const { id } = await params;
  const caseResult = await loadCaseDetail(id);

  if (caseResult.error || !caseResult.data) {
    return (
      <div
        data-admin-surface
        className="rounded-md border-0 bg-card p-6 text-sm font-medium text-destructive shadow-[var(--admin-card-shadow)]"
      >
        {caseResult.error?.message ?? "No se pudo cargar el expediente."}
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-104px)] flex-col gap-6 overflow-visible md:min-h-[calc(100svh-152px)] md:gap-6">
      <CaseDetailSummary caseItem={caseResult.data} />
      <section className="grid gap-6 overflow-visible xl:grid-cols-[minmax(0,1fr)_340px]">
        <CaseCalendarCard
          canCreateExpense={hasPermission(session, "expenses:create")}
          canUpdateExpense={hasPermission(session, "expenses:update")}
          caseId={caseResult.data.id}
        />
        <CaseExpensesBreakdownCard
          canReadExpense={hasPermission(session, "expenses:read")}
          caseId={caseResult.data.id}
        />
      </section>
      <section className="min-h-0 flex-1 overflow-visible">
        <CaseTasksTable
          canCreate={hasPermission(session, "tasks:create")}
          canCreateExpense={hasPermission(session, "expenses:create")}
          canDelete={hasPermission(session, "tasks:delete")}
          canDeleteExpense={hasPermission(session, "expenses:delete")}
          canReadExpense={hasPermission(session, "expenses:read")}
          canUpdate={hasPermission(session, "tasks:update")}
          canUpdateExpense={hasPermission(session, "expenses:update")}
          caseId={caseResult.data.id}
        />
      </section>
    </div>
  );
}

async function loadCaseDetail(caseId: string) {
  try {
    return {
      data: await getCaseDetailServer(caseId),
      error: null
    };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error : new Error("No se pudo cargar el expediente.")
    };
  }
}
