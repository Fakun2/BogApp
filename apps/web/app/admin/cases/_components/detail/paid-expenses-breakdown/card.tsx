"use client";

import { useMemo, useState } from "react";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminSurfaceClassName } from "../../../../_constants/dashboard";
import { casesQueries } from "../../../_api/cases.query-controller";
import { useCasesQuery } from "../../../_hooks/use-cases-query";
import { emptyPaidExpenseChartColor, paidExpenseChartColors } from "./constants";
import { CaseExpensesAllPopup } from "../paid-expenses-popup";
import { PaidExpensesDonut } from "./paid-expenses-donut";
import { PaidExpensesList } from "./paid-expenses-list";
import {
  PaidExpensesBreakdownError,
  PaidExpensesBreakdownRestricted,
  PaidExpensesBreakdownSkeleton
} from "./paid-expenses-states";

export function CaseExpensesBreakdownCard({
  canReadExpense,
  caseId
}: {
  canReadExpense: boolean;
  caseId: string;
}) {
  const [allExpensesOpen, setAllExpensesOpen] = useState(false);
  const summaryQuery = useCasesQuery(casesQueries.expensesSummary(caseId));
  const chartItems = useMemo(
    () =>
      (summaryQuery.data?.items ?? []).map((item, index) => ({
        ...item,
        color: paidExpenseChartColors[index % paidExpenseChartColors.length] ?? paidExpenseChartColors[0]
      })),
    [summaryQuery.data?.items]
  );
  const totalAmount = summaryQuery.data?.totalAmount ?? 0;
  const hasExpenses = chartItems.length > 0 && totalAmount > 0;
  const chartData = hasExpenses
    ? chartItems
    : [
        {
          amount: 1,
          color: emptyPaidExpenseChartColor,
          concept: "Sin gastos",
          id: "empty",
          percentage: 0
        }
      ];

  return (
    <>
      <Card
        data-admin-surface
        className={`${adminSurfaceClassName} min-h-[320px] overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
      >
        <header className="flex items-center justify-between gap-3 px-4 py-2 md:px-5">
          <h2 className="flex min-w-0 items-center gap-2 truncate text-base font-semibold text-foreground">
            <Banknote className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
            <span className="truncate">Gastos pagados</span>
          </h2>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl border-border/50 px-4 text-sm font-medium"
            disabled={!canReadExpense || !summaryQuery.hasPermission}
            onClick={() => setAllExpensesOpen(true)}
          >
            Ver mas
          </Button>
        </header>
        <CardContent className="px-4 pb-2.5 md:px-5">
          <section className="grid gap-1.5" aria-label="Resumen de gastos pagados del expediente">
            {summaryQuery.isLoading ? (
              <PaidExpensesBreakdownSkeleton />
            ) : summaryQuery.error ? (
              <PaidExpensesBreakdownError message={summaryQuery.error.message} />
            ) : !canReadExpense || !summaryQuery.hasPermission ? (
              <PaidExpensesBreakdownRestricted />
            ) : (
              <>
                <PaidExpensesDonut
                  chartData={chartData}
                  hasExpenses={hasExpenses}
                  totalAmount={totalAmount}
                />
                <PaidExpensesList expenses={chartItems} />
              </>
            )}
          </section>
        </CardContent>
      </Card>
      {allExpensesOpen ? (
        <CaseExpensesAllPopup caseId={caseId} onClose={() => setAllExpensesOpen(false)} />
      ) : null}
    </>
  );
}
