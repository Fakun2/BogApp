import { CaseCalendarCard } from "../../_components/detail/case-calendar";
import { CaseDetailSummary } from "../../_components/detail/case-detail-summary";
import { CaseHearingsTable } from "../../_components/detail/case-hearings-table";
import { CaseExpensesBreakdownCard } from "../../_components/detail/paid-expenses-breakdown";
import { CaseTasksTable } from "../../_components/detail/tasks-table";
import type { CaseDetailDto } from "../../_types/cases.types";
import { CaseAiPanel } from "./ai/case-ai-panel";
import type { CaseDetailPermissions } from "../_types/case-detail-page.types";

export function CaseDetailView({
  caseItem,
  permissions
}: {
  caseItem: CaseDetailDto;
  permissions: CaseDetailPermissions;
}) {
  return (
    <div className="flex min-h-[calc(100svh-104px)] flex-col gap-4 overflow-visible md:min-h-[calc(100svh-112px)] md:gap-5">
      <CaseDetailSummary caseItem={caseItem} />
      <CaseAiPanel canUseAi={permissions.canUseCaseAi} caseItem={caseItem} />
      <section className="grid gap-6 overflow-visible lg:grid-cols-[minmax(0,1fr)_340px]">
        <CaseCalendarCard
          canCreateExpense={permissions.canCreateExpense}
          canCreateHearing={permissions.canCreateHearing}
          canCreateTask={permissions.canCreateTask}
          canUpdateExpense={permissions.canUpdateExpense}
          caseId={caseItem.id}
        />
        <CaseExpensesBreakdownCard
          canReadExpense={permissions.canReadExpense}
          caseId={caseItem.id}
        />
      </section>
      <section className="min-h-0 flex-1 overflow-visible">
        <CaseHearingsTable
          canCreate={permissions.canCreateHearing}
          canDelete={permissions.canDeleteHearing}
          canUpdate={permissions.canUpdateHearing}
          caseId={caseItem.id}
        />
      </section>
      <section className="min-h-0 flex-1 overflow-visible">
        <CaseTasksTable
          canCreate={permissions.canCreateTask}
          canCreateExpense={permissions.canCreateExpense}
          canDelete={permissions.canDeleteTask}
          canDeleteExpense={permissions.canDeleteExpense}
          canReadExpense={permissions.canReadExpense}
          canUpdate={permissions.canUpdateTask}
          canUpdateExpense={permissions.canUpdateExpense}
          caseId={caseItem.id}
        />
      </section>
    </div>
  );
}
