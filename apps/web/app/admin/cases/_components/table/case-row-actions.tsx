"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import type { CaseDto } from "../../_types/cases.types";
import { CaseSheet } from "../sheet/case-sheet";
import { DeleteCasesDialog } from "./delete-cases-dialog";

export function CaseRowActions({
  canDelete,
  canUpdate,
  caseItem
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseItem: CaseDto;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useCasesMutation(casesMutations.deleteCase());
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(caseItem.id);
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      // The mutation exposes its error state if the request fails.
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 border-border/50 p-0"
            disabled={deleteMutation.isPending}
            aria-label={`Acciones para ${caseItem.caseNumber}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => router.push(`/admin/cases/${caseItem.id}`)}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Ver detalle
          </DropdownMenuItem>
          {canUpdate ? (
            <CaseSheet
              caseItem={caseItem}
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
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCasesDialog
        count={1}
        error={deleteMutation.error?.message}
        loading={deleteMutation.isPending}
        open={deleteDialogOpen}
        targetLabel={caseItem.caseNumber}
        onConfirm={() => void handleDelete()}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
