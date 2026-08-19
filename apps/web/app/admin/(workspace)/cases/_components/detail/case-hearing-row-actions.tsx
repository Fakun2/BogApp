"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import type { CaseHearingDto } from "../../_types/cases.types";
import { CaseHearingSheet } from "./hearing-sheet";

export function CaseHearingRowActions({
  canDelete,
  canUpdate,
  caseId,
  hearing
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseId: string;
  hearing: CaseHearingDto;
}) {
  const deleteMutation = useCasesMutation(casesMutations.deleteHearing(caseId));

  if (!canDelete && !canUpdate) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-7 w-7 rounded-xl border-border/50 p-0"
          aria-label="Acciones de audiencia"
        >
          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canUpdate ? (
          <CaseHearingSheet
            caseId={caseId}
            hearing={hearing}
            trigger={
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar
              </DropdownMenuItem>
            }
          />
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            className="text-foreground focus:text-foreground"
            disabled={deleteMutation.isPending}
            onSelect={() => {
              void deleteMutation.mutateAsync(hearing.id);
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
