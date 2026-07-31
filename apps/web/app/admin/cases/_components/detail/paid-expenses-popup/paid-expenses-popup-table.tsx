import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { caseExpenseStatusLabels } from "../../../_constants/cases.constants";
import type { CaseExpenseDto } from "../../../_types/cases.types";
import { formatCaseMoney, getExpenseStatusClassName } from "../case-detail-format";

export function PaidExpensesPopupTable({ expenses }: { expenses: CaseExpenseDto[] }) {
  return (
    <section
      className="max-h-[52svh] overflow-auto rounded-2xl border border-border/40"
      aria-label="Gastos pagados"
    >
      <Table className="min-w-[520px]">
        <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 px-4 text-sm font-medium text-foreground">Gasto</TableHead>
            <TableHead className="h-10 px-4 text-sm font-medium text-foreground">Monto</TableHead>
            <TableHead className="h-10 px-4 text-sm font-medium text-foreground">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow className="h-14 border-border/40 hover:bg-secondary/30" key={expense.id}>
              <TableCell className="max-w-[320px] px-4 py-3">
                <span className="block truncate font-medium text-foreground">
                  {expense.concept}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
                {formatCaseMoney(expense.amount)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getExpenseStatusClassName(
                    expense.status
                  )}`}
                >
                  {caseExpenseStatusLabels[expense.status]}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
