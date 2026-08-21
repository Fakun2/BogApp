"use client";

import { useState } from "react";
import { CalendarDays, CircleDollarSign, Gavel, ListTodo } from "lucide-react";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { RequirePermission } from "../_components/auth";
import { AdminMetricsGrid } from "../_components/admin-metrics-grid";
import { RestrictedCases } from "../cases/_components/access/restricted-cases";
import { casesQueries } from "../cases/_api/cases.query-controller";
import type { CasePickerOption } from "../cases/_components/case-picker-field";
import { useCasesQuery } from "../cases/_hooks/use-cases-query";
import { CalendarCard } from "./_components/calendar-card";
import { getCurrentMonthKey } from "./_utils/calendar-date-utils";

export default function CalendarPage() {
  return (
    <RequirePermission permissions={["cases:read"]} fallback={<RestrictedCases />}>
      <TenantCalendarContent />
    </RequirePermission>
  );
}

function TenantCalendarContent() {
  const session = useSession();
  const [selectedCase, setSelectedCase] = useState<CasePickerOption | null>(null);
  const caseId = selectedCase?.id;
  const canCreateExpense = hasPermission(session, "expenses:create");
  const canCreateHearing = hasPermission(session, "hearings:create");
  const canCreateTask = hasPermission(session, "tasks:create");
  const canUpdateExpense = hasPermission(session, "expenses:update");
  const metricsQuery = useCasesQuery(
    casesQueries.tenantCalendar({
      caseId,
      mode: "month",
      month: getCurrentMonthKey()
    })
  );
  const metrics = metricsQuery.data?.metrics;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-none md:gap-4">
      <AdminMetricsGrid
        metrics={[
          {
            detail: "Total del estudio",
            icon: ListTodo,
            label: "Tareas totales",
            loading: metricsQuery.isLoading,
            value: metrics?.totalTasks ?? 0
          },
          {
            detail: "Pendientes y en curso",
            icon: CalendarDays,
            label: "Tareas pendientes",
            loading: metricsQuery.isLoading,
            value: metrics?.pendingTasks ?? 0
          },
          {
            detail: "Audiencias cargadas",
            icon: Gavel,
            label: "Audiencias",
            loading: metricsQuery.isLoading,
            value: metrics?.hearingsCount ?? 0
          },
          {
            detail: "Pendientes y vencidos",
            icon: CircleDollarSign,
            label: "Gastos pendientes",
            loading: metricsQuery.isLoading,
            value: metrics?.pendingExpensesCount ?? 0
          }
        ]}
      />

      <section className="grid gap-3">
        <div className="rounded-2xl border border-border/40 bg-card/70 p-3 shadow-[var(--admin-card-shadow)]">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground">Calendario del estudio</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {selectedCase
                ? `${selectedCase.caseNumber} - ${selectedCase.caption}`
                : "Todos los expedientes"}
            </p>
          </div>
        </div>

        <CalendarCard
          canCreateExpense={canCreateExpense}
          canCreateHearing={canCreateHearing}
          canCreateTask={canCreateTask}
          canUpdateExpense={canUpdateExpense}
          caseId={caseId}
          selectedCase={selectedCase}
          onClearCaseFilter={() => setSelectedCase(null)}
          onSelectCaseFilter={setSelectedCase}
          scope="tenant"
        />
      </section>
    </div>
  );
}
