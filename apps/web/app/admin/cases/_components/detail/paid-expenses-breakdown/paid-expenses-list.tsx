import { formatCaseMoney } from "../case-detail-format";
import type { PaidExpenseChartItem } from "./types";

export function PaidExpensesList({ expenses }: { expenses: PaidExpenseChartItem[] }) {
  if (!expenses.length) {
    return (
      <p className="flex min-h-[116px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
        Todavia no hay gastos pagados.
      </p>
    );
  }

  return (
    <ul className="grid gap-2" aria-label="Top gastos pagados del expediente">
      {expenses.map((expense) => (
        <PaidExpenseListItem expense={expense} key={expense.id} />
      ))}
    </ul>
  );
}

function PaidExpenseListItem({ expense }: { expense: PaidExpenseChartItem }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: expense.color }}
          aria-hidden="true"
        />
        <span className="truncate text-muted-foreground">{expense.concept}</span>
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {formatCaseMoney(expense.amount)}
      </span>
      <span className="w-10 text-right text-sm font-semibold text-foreground">
        {Math.round(expense.percentage)}%
      </span>
    </li>
  );
}
