"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import type { CaseExpenseDto, CaseTaskDto } from "../../_types/cases.types";
import { CaseExpenseSheet } from "./expense-sheet";

export function CaseExpenseRowActions({
  canDelete,
  canUpdate,
  caseId,
  expense,
  tasks
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseId: string;
  expense: CaseExpenseDto;
  tasks: CaseTaskDto[];
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteMutation = useCasesMutation(casesMutations.deleteExpense(caseId));
  const router = useRouter();

  if (!canDelete && !canUpdate) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(expense.id);
      setDeleteOpen(false);
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
            className="h-8 w-8 border-border/50 p-0"
            disabled={deleteMutation.isPending}
            aria-label={`Acciones para ${expense.concept}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
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
              disabled={deleteMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setDeleteOpen(true);
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
          expense={expense}
          onOpenChange={setEditOpen}
          open={editOpen}
          tasks={tasks}
        />
      ) : null}
      {canDelete ? (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Eliminar gasto</DialogTitle>
              <DialogDescription>
                Esta accion elimina el gasto del expediente y actualiza los datos asociados.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border border-border/50 bg-background/45 px-3 py-2 text-sm font-medium text-foreground">
              {expense.concept}
            </div>
            {deleteMutation.error ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
                {deleteMutation.error.message}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 border-border/50 px-4"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-9 px-4"
                disabled={deleteMutation.isPending}
                onClick={() => void handleDelete()}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
