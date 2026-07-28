"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteCaseTaskMutation } from "../../_hooks/use-delete-case-task-mutation";
import type { CaseTaskDto } from "../../_types/cases.types";
import { CaseExpenseSheet } from "./case-expense-sheet";
import { CaseTaskExpensesPopup } from "./case-task-expenses-popup";
import { CaseTaskSheet } from "./case-task-sheet";

export function CaseTaskRowActions({
  canCreateExpense,
  canDelete,
  canDeleteExpense,
  canReadExpense,
  canUpdate,
  canUpdateExpense,
  caseId,
  task
}: {
  canCreateExpense: boolean;
  canDelete: boolean;
  canDeleteExpense: boolean;
  canReadExpense: boolean;
  canUpdate: boolean;
  canUpdateExpense: boolean;
  caseId: string;
  task: CaseTaskDto;
}) {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteMutation = useDeleteCaseTaskMutation(caseId);
  const router = useRouter();
  const hasExpenseActions = canCreateExpense || canReadExpense;

  if (!canDelete && !canUpdate && !hasExpenseActions) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(task.id);
      router.refresh();
    } catch {
      // The mutation exposes its error state if the request fails.
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 rounded-lg border-border/50 p-0"
            disabled={deleteMutation.isPending}
            aria-label={`Acciones para ${task.name}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canReadExpense ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setExpensesOpen(true);
              }}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Ver gastos
            </DropdownMenuItem>
          ) : null}
          {canCreateExpense ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setAddExpenseOpen(true);
              }}
            >
              <Banknote className="h-4 w-4" aria-hidden="true" />
              Agregar gasto
            </DropdownMenuItem>
          ) : null}
          {canUpdate ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setEditTaskOpen(true);
              }}
            >
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              Editar
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={deleteMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                void handleDelete();
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canCreateExpense ? (
        <CaseExpenseSheet
          caseId={caseId}
          defaultTaskId={task.id}
          hideTaskSelect
          onOpenChange={setAddExpenseOpen}
          open={addExpenseOpen}
          tasks={[task]}
        />
      ) : null}

      {canUpdate ? (
        <CaseTaskSheet
          caseId={caseId}
          onOpenChange={setEditTaskOpen}
          open={editTaskOpen}
          task={task}
        />
      ) : null}

      {expensesOpen ? (
        <CaseTaskExpensesPopup
          canDelete={canDeleteExpense}
          canUpdate={canUpdateExpense}
          caseId={caseId}
          onClose={() => setExpensesOpen(false)}
          task={task}
        />
      ) : null}
    </>
  );
}
