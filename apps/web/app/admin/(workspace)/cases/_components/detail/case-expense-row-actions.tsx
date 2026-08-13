"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const deleteMutation = useCasesMutation(casesMutations.deleteExpense(caseId));
  const router = useRouter();

  if (!canDelete && !canUpdate) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(expense.id);
      router.refresh();
    } catch {
      // The mutation exposes its error state if the request fails.
    }
  }

  return (
    <DropdownMenu>
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
          <CaseExpenseSheet
            caseId={caseId}
            expense={expense}
            tasks={tasks}
            trigger={
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <PencilLine className="h-4 w-4" aria-hidden="true" />
                Editar
              </DropdownMenuItem>
            }
          />
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={deleteMutation.isPending}
            onSelect={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
