"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Paperclip,
  PencilLine,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { caseExpenseStatusLabels } from "../../_constants/cases.constants";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { useCaseExpensesQuery } from "../../_hooks/use-case-expenses-query";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import type { CaseExpenseDto, CaseTaskDto } from "../../_types/cases.types";
import { formatCaseMoney, getExpenseStatusClassName } from "./case-detail-format";
import { CaseExpenseAttachmentsPopup } from "./case-expense-attachments-popup";
import { CaseExpenseSheet } from "./expense-sheet";

export function CaseTaskExpensesPopup({
  canDelete,
  canUpdate,
  caseId,
  onClose,
  task
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseId: string;
  onClose: () => void;
  task: CaseTaskDto;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const deleteMutation = useCasesMutation(casesMutations.deleteExpense(caseId));
  const expensesQuery = useCaseExpensesQuery({ caseId, taskId: task.id });
  const router = useRouter();
  const pageExpenses = expensesQuery.data?.items ?? [];
  const hasPreviousPage = expensesQuery.canGoBack;
  const hasNextPage = Boolean(expensesQuery.data?.pageInfo.hasNextPage);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  }

  async function handleDelete(expenseId: string) {
    try {
      await deleteMutation.mutateAsync(expenseId);
      router.refresh();
    } catch {
      // The mutation exposes its error state if the request fails.
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-200 ease-out ${
        isClosing || !isVisible ? "opacity-0 backdrop-blur-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Gastos de ${task.name}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        data-admin-surface
        className={`flex max-h-[82svh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--admin-card-shadow)] transition-[opacity,transform] duration-200 ease-out ${
          isClosing || !isVisible
            ? "translate-y-2 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/30 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">Gastos de la tarea</h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">{task.name}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-7 w-7 border-border/50 p-0"
            onClick={requestClose}
            aria-label="Cerrar gastos"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {expensesQuery.isLoading ? (
            <div className="grid gap-3">
              <div className="overflow-hidden rounded-2xl border border-border/40">
                <div className="h-10 bg-[color-mix(in_oklab,var(--muted)_28%,transparent)]" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="grid h-14 grid-cols-[1fr_120px_120px_56px] gap-4 border-t border-border/30 px-3 py-3"
                    key={index}
                  >
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4 rounded-full" />
                    <Skeleton className="h-4" />
                  </div>
                ))}
              </div>
            </div>
          ) : expensesQuery.error ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-center text-sm font-medium text-destructive">
              {expensesQuery.error.message}
            </div>
          ) : pageExpenses.length ? (
            <div className="grid gap-3">
              <div className="max-h-[52svh] overflow-auto rounded-2xl border border-border/40">
                <Table className="min-w-[560px]">
                  <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-10 px-3 text-sm font-medium text-foreground">
                        Gasto
                      </TableHead>
                      <TableHead className="h-10 px-3 text-sm font-medium text-foreground">
                        Monto
                      </TableHead>
                      <TableHead className="h-10 px-3 text-sm font-medium text-foreground">
                        Estado
                      </TableHead>
                      {canUpdate || canDelete ? (
                        <TableHead className="h-10 px-3 text-right text-sm font-medium text-foreground">
                          Acciones
                        </TableHead>
                      ) : null}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageExpenses.map((expense) => (
                      <TableRow
                        className="h-14 border-border/40 hover:bg-secondary/30"
                        key={expense.id}
                      >
                        <TableCell className="max-w-[260px] px-3 py-3">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="block truncate font-medium text-foreground">
                              {expense.concept}
                            </span>
                            {expense.attachments.length ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                                <Paperclip className="h-3 w-3" aria-hidden="true" />
                                {expense.attachments.length}
                              </span>
                            ) : null}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-3 text-sm font-medium text-foreground">
                          {formatCaseMoney(expense.amount, expense.currencyCode)}
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getExpenseStatusClassName(
                              expense.status
                            )}`}
                          >
                            {caseExpenseStatusLabels[expense.status]}
                          </span>
                        </TableCell>
                        {canUpdate || canDelete ? (
                          <TableCell className="px-3 py-3 text-right">
                            <ExpensePopupRowActions
                              canDelete={canDelete}
                              canUpdate={canUpdate}
                              caseId={caseId}
                              deleteDisabled={deleteMutation.isPending}
                              expense={expense}
                              onDelete={() => void handleDelete(expense.id)}
                              task={task}
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>
                  Pagina {expensesQuery.pageIndex + 1} - {pageExpenses.length} gastos
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-7 w-7 border-border/50 p-0"
                    disabled={!hasPreviousPage}
                    onClick={expensesQuery.goBack}
                    aria-label="Pagina anterior"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-7 w-7 border-border/50 p-0"
                    disabled={!hasNextPage}
                    onClick={expensesQuery.goForward}
                    aria-label="Pagina siguiente"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
              Todavia no hay gastos asociados a esta tarea.
            </div>
          )}

          {deleteMutation.error ? (
            <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {deleteMutation.error.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExpensePopupRowActions({
  canDelete,
  canUpdate,
  caseId,
  deleteDisabled,
  expense,
  onDelete,
  task
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseId: string;
  deleteDisabled: boolean;
  expense: CaseExpenseDto;
  onDelete: () => void;
  task: CaseTaskDto;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!canUpdate && !canDelete) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-7 w-7 border-border/50 p-0"
            disabled={deleteDisabled}
            aria-label={`Acciones para ${expense.concept}`}
          >
            <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              setAttachmentsOpen(true);
            }}
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            Ver comprobantes
          </DropdownMenuItem>
          {canUpdate ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setAttachmentsOpen(true);
              }}
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              Subir comprobante
            </DropdownMenuItem>
          ) : null}
          {canUpdate ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setEditOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              Editar
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={deleteDisabled}
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {canUpdate ? (
        <CaseExpenseSheet
          caseId={caseId}
          defaultTaskId={task.id}
          expense={expense}
          hideTaskSelect
          onOpenChange={setEditOpen}
          open={editOpen}
          tasks={[task]}
        />
      ) : null}
      {attachmentsOpen ? (
        <CaseExpenseAttachmentsPopup
          canUpdate={canUpdate}
          caseId={caseId}
          expense={expense}
          onClose={() => setAttachmentsOpen(false)}
        />
      ) : null}
    </>
  );
}
