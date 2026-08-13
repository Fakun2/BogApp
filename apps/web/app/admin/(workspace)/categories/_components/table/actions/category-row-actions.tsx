"use client";

import { useState } from "react";
import { Edit3, MoreHorizontal, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useDeleteCategoryMutation } from "../../../_hooks/use-categories-query";
import type { CategoryDto } from "../../../_types/categories.types";
import { CategoryFormDialog } from "./category-form-dialog";
import { DisableCategoryDialog } from "./disable-category-dialog";

export function CategoryRowActions({
  category,
  onSuccess
}: {
  category: CategoryDto;
  onSuccess: () => void;
}) {
  const session = useSession();
  const canUpdate = hasPermission(session, "categories:update");
  const canDelete = hasPermission(session, "categories:delete");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteCategoryMutation();
  const canMutate = category.origin === "tenant" && (canUpdate || canDelete);

  if (!canMutate) {
    return <span className="text-xs text-muted-foreground">Solo lectura</span>;
  }

  async function handleDisable() {
    try {
      await deleteMutation.mutateAsync(category.id);
      setConfirmOpen(false);
      onSuccess();
    } catch {
      // Mutation error is shown in the confirmation dialog.
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 border-border/50 p-0">
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Abrir acciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canUpdate ? (
            <CategoryFormDialog
              category={category}
              mode="update"
              onSuccess={onSuccess}
              trigger={
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Edit3 className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              }
            />
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setConfirmOpen(true)}
            >
              <PowerOff className="h-4 w-4" />
              Deshabilitar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <DisableCategoryDialog
        category={category}
        error={deleteMutation.error?.message}
        loading={deleteMutation.isPending}
        open={confirmOpen}
        onConfirm={handleDisable}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
}
