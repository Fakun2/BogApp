"use client";

import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteCaseMutation } from "../../_hooks/use-delete-case-mutation";
import type { CaseDto } from "../../_types/cases.types";
import { CaseSheet } from "../sheet/case-sheet";

export function CaseRowActions({
  canDelete,
  canUpdate,
  caseItem
}: {
  canDelete: boolean;
  canUpdate: boolean;
  caseItem: CaseDto;
}) {
  const deleteMutation = useDeleteCaseMutation();
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(caseItem.id);
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
          className="h-8 w-8 rounded-lg border-border/50 p-0"
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
