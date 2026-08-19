"use client";

import { useMemo, useState, type FormEvent } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useCategoriesQuery } from "../../categories/_hooks/use-categories-query";
import {
  useDeleteCashboxMovementMutation,
  useUpdateCashboxMovementMutation
} from "../_hooks/use-cashbox-query";
import type { CashboxMovementDto, UpdateCashboxMovementInput } from "../_types/cashbox.types";
import { filterCategoriesForMovement } from "../_utils/cashbox-categories";
import { canonicalDecimalToLocal, isPositiveLocalDecimal } from "../_utils/local-decimal";
import { CashboxDialogActions } from "./cashbox-dialog-actions";
import { LocalDecimalInput } from "./local-decimal-input";

type EditableCashboxMovement = CashboxMovementDto & { type: "income" | "expense" };

export function CashboxRowActions({ movement }: { movement: CashboxMovementDto }) {
  const session = useSession();
  const canUpdate = hasPermission(session, "finance:update");
  const canDelete = hasPermission(session, "finance:delete");

  if (movement.type === "conversion_in" || movement.type === "conversion_out" || (!canUpdate && !canDelete)) {
    return <span className="text-xs text-muted-foreground">Sin acciones</span>;
  }

  return (
    <MovementActionsMenu
      canDelete={canDelete}
      canUpdate={canUpdate}
      movement={movement as EditableCashboxMovement}
    />
  );
}

function MovementActionsMenu({
  canDelete,
  canUpdate,
  movement
}: {
  canDelete: boolean;
  canUpdate: boolean;
  movement: EditableCashboxMovement;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Acciones de movimiento">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {canUpdate ? (
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              className="text-foreground focus:text-foreground"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <EditMovementDialog movement={movement} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteMovementDialog movement={movement} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

function EditMovementDialog({
  movement,
  onOpenChange,
  open
}: {
  movement: EditableCashboxMovement;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const [amount, setAmount] = useState(canonicalDecimalToLocal(movement.amount));
  const [categoryValue, setCategoryValue] = useState(getInitialCategoryValue(movement));
  const [description, setDescription] = useState(movement.description ?? "");
  const mutation = useUpdateCashboxMovementMutation();
  const categoriesQuery = useCategoriesQuery({
    cursor: null,
    kind: "all",
    limit: 50,
    origin: "all",
    search: "",
    sort: "name:asc",
    status: "active"
  });
  const categories = useMemo(
    () => filterCategoriesForMovement(categoriesQuery.data?.items ?? [], movement.type),
    [categoriesQuery.data?.items, movement.type]
  );

  function resetFromMovement() {
    setAmount(canonicalDecimalToLocal(movement.amount));
    setCategoryValue(getInitialCategoryValue(movement));
    setDescription(movement.description ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPositiveLocalDecimal(amount, 2)) {
      return;
    }

    const input: UpdateCashboxMovementInput = {
      amount,
      category: categoryValue === "none" ? null : parseCategoryValue(categoryValue),
      description: description.trim() || undefined
    };

    await mutation.mutateAsync({ id: movement.id, input });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (nextOpen) {
          resetFromMovement();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar movimiento</DialogTitle>
          <DialogDescription>Actualiza los datos del movimiento seleccionado.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input value={`${movement.currencyCode} · ${movement.currencySymbol}`} disabled className="h-11" />
          <label className="grid gap-2 text-sm font-medium">
            Monto
            <LocalDecimalInput value={amount} onChange={setAmount} decimalScale={2} className="h-11" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Categoria
            <Select value={categoryValue} onValueChange={setCategoryValue}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoria</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={`${category.origin}:${category.id}`} value={`${category.origin}:${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Descripcion
            <Input value={description} onChange={(event) => setDescription(event.target.value)} className="h-11" />
          </label>
          {mutation.error ? <p className="text-sm text-destructive">{mutation.error.message}</p> : null}
          <CashboxDialogActions loading={mutation.isPending} onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteMovementDialog({
  movement,
  onOpenChange,
  open
}: {
  movement: CashboxMovementDto;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const mutation = useDeleteCashboxMovementMutation();

  async function handleDelete() {
    await mutation.mutateAsync(movement.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar movimiento</DialogTitle>
          <DialogDescription>Esta accion eliminara el movimiento de la caja y recalculara el saldo.</DialogDescription>
        </DialogHeader>
        {mutation.error ? <p className="text-sm text-destructive">{mutation.error.message}</p> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" disabled={mutation.isPending} onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getInitialCategoryValue(movement: CashboxMovementDto) {
  return movement.categoryOrigin && movement.categoryId
    ? `${movement.categoryOrigin}:${movement.categoryId}`
    : "none";
}

function parseCategoryValue(value: string) {
  const [origin, id] = value.split(":") as ["global" | "tenant", string];

  return { id, origin };
}
