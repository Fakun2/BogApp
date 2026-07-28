import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../../../_constants/dashboard";
import { caseExpenseStatusLabels } from "../../_constants/cases.constants";
import type { CaseExpenseDto, CaseTaskDto } from "../../_types/cases.types";
import { formatCaseDate, formatCaseMoney, getExpenseStatusClassName } from "./case-detail-format";
import { CaseExpenseRowActions } from "./case-expense-row-actions";
import { CaseExpenseSheet } from "./case-expense-sheet";

export function CaseExpensesTable({
  canCreate,
  canDelete,
  canUpdate,
  caseId,
  expenses,
  tasks
}: {
  canCreate: boolean;
  canDelete: boolean;
  canUpdate: boolean;
  caseId: string;
  expenses: CaseExpenseDto[];
  tasks: CaseTaskDto[];
}) {
  const hasActions = canDelete || canUpdate;
  const columnCount = hasActions ? 8 : 7;

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-[320px] flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-3 border-b border-border/30 px-4 py-4 md:gap-4 md:px-6 md:py-5">
        <div className="min-w-0">
          <CardTitle className={`text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
            Gastos del expediente
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Gastos propios del expediente, asociados opcionalmente a una tarea.
          </p>
        </div>
        {canCreate ? (
          <CaseExpenseSheet
            caseId={caseId}
            tasks={tasks}
            trigger={
              <Button type="button" className="h-9 px-3">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Nuevo gasto
              </Button>
            }
          />
        ) : null}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-2xl">
          <Table className="min-w-full text-xs">
            <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Concepto
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Monto
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Emision
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Pago
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Estado
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Tarea
                </TableHead>
                <TableHead className="h-11 px-4 text-sm font-medium text-foreground">
                  Observaciones
                </TableHead>
                {hasActions ? (
                  <TableHead className="h-11 px-4 text-right text-sm font-medium text-foreground">
                    Acciones
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-0">
              {expenses.length ? (
                expenses.map((expense) => (
                  <TableRow
                    className="h-[70px] border-border/40 hover:bg-secondary/30"
                    key={expense.id}
                  >
                    <TableCell className="px-4 py-4">
                      <span className="font-medium text-foreground">{expense.concept}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-medium text-foreground">
                      {formatCaseMoney(expense.amount)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {formatCaseDate(expense.expenseDate)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {formatCaseDate(expense.paymentDate)}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getExpenseStatusClassName(
                          expense.status
                        )}`}
                      >
                        {caseExpenseStatusLabels[expense.status]}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[220px] px-4 py-4">
                      <span className="block truncate text-sm text-muted-foreground">
                        {expense.task?.name || "Sin tarea"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[260px] px-4 py-4">
                      <span className="block truncate text-sm text-muted-foreground">
                        {expense.alertEnabled
                          ? `Alerta: ${formatCaseDate(expense.alertAt)}`
                          : expense.notes || "Sin observaciones"}
                      </span>
                    </TableCell>
                    {hasActions ? (
                      <TableCell className="px-4 py-4 text-right">
                        <div className="flex justify-end">
                          <CaseExpenseRowActions
                            canDelete={canDelete}
                            canUpdate={canUpdate}
                            caseId={caseId}
                            expense={expense}
                            tasks={tasks}
                          />
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-[220px] hover:bg-transparent">
                  <TableCell
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                    colSpan={columnCount}
                  >
                    Todavia no hay gastos cargados para este expediente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
