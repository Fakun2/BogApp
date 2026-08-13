"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from "../../../_hooks/use-categories-query";
import type {
  CategoryDto,
  CreateCategoryInput,
  FinanceCategoryKind
} from "../../../_types/categories.types";

export function CategoryFormDialog({
  category,
  mode,
  onSuccess,
  trigger
}: {
  category?: CategoryDto;
  mode: "create" | "update";
  onSuccess: () => void;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateCategoryInput>(() => getCategoryFormInitialValues(category));
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const mutation = mode === "create" ? createMutation : updateMutation;

  useEffect(() => {
    if (open) {
      setForm(getCategoryFormInitialValues(category));
      setError(null);
    }
  }, [category, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();

    if (name.length < 2 || name.length > 80) {
      setError("El nombre debe tener entre 2 y 80 caracteres.");
      return;
    }

    setError(null);
    try {
      if (mode === "create") {
        await createMutation.mutateAsync({ active: true, kind: form.kind, name });
      } else if (category) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          input: { active: form.active, kind: form.kind, name }
        });
      }
      setOpen(false);
      onSuccess();
    } catch {
      // Mutation error is rendered below.
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <AdminTableHeaderActionButton
          icon={Plus}
          label="Nueva"
          tone="primary"
          onClick={() => setOpen(true)}
        />
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nueva categoria" : "Editar categoria"}</DialogTitle>
          <DialogDescription>Configura una categoria financiera propia del estudio.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Nombre
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Honorarios extraordinarios"
              className="h-11"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Tipo
            <Select
              value={form.kind}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, kind: value as FinanceCategoryKind }))
              }
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Ingreso</SelectItem>
                <SelectItem value="expense">Egreso</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </label>
          {mode === "update" ? (
            <label className="grid gap-2 text-sm font-medium">
              Estado
              <Select
                value={form.active === false ? "inactive" : "active"}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, active: value === "active" }))
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </label>
          ) : null}
          {error || mutation.error ? (
            <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error ?? mutation.error?.message}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getCategoryFormInitialValues(category?: CategoryDto): CreateCategoryInput {
  return {
    active: category?.active ?? true,
    kind: category?.kind ?? "expense",
    name: category?.name ?? ""
  };
}
