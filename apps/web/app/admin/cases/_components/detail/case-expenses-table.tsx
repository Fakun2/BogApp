import { Banknote, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AdminTableHeader } from "../../../_components/admin-table-header";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
import { caseExpenseStatusLabels } from "../../_constants/cases.constants";
import type { CaseExpenseDto, CaseTaskDto } from "../../_types/cases.types";
import { formatCaseDate, formatCaseMoney, getExpenseStatusClassName } from "./case-detail-format";
import { CaseExpenseRowActions } from "./case-expense-row-actions";
import { CaseExpenseSheet } from "./expense-sheet";

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
      <AdminTableHeader
        actions={
          canCreate ? (
            <CaseExpenseSheet
              caseId={caseId}
              tasks={tasks}
              trigger={
                <AdminTableHeaderActionButton icon={Plus} label="Nuevo gasto" tone="primary" />
              }
            />
          ) : null
        }
        description="Gastos propios del expediente, asociados opcionalmente a una tarea."
        icon={Banknote}
        title="Gastos del expediente"
      />
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
        <div className="max-h-[56svh] min-h-0 flex-1 overflow-auto rounded-2xl">
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
