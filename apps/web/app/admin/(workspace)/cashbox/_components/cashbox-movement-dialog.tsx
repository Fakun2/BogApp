"use client";

import { useState, type FormEvent } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AdminTableHeaderActionButton } from "../../_components/admin-table-header-action-button";
import { useCashboxMovementForm } from "../_hooks/use-cashbox-movement-form";
import { CashboxDialogActions } from "./cashbox-dialog-actions";
import { LocalDecimalInput } from "./local-decimal-input";

export function CashboxMovementDialog({
  currentBalance,
  currentBalanceSymbol,
  currencyCode,
  mode,
  onSuccess
}: {
  currentBalance?: string;
  currentBalanceSymbol?: string;
  currencyCode?: string;
  mode: "income" | "expense";
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useCashboxMovementForm({
    currentBalance,
    currentBalanceSymbol,
    currencyCode,
    mode,
    onSuccess
  });
  const Icon = mode === "income" ? ArrowDownLeft : ArrowUpRight;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const submitted = await form.handleSubmit(event);
    setOpen(!submitted);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AdminTableHeaderActionButton
        icon={Icon}
        label={mode === "income" ? "Ingreso" : "Egreso"}
        tone={mode === "income" ? "primary" : "secondary"}
        onClick={() => setOpen(true)}
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "income" ? "Nuevo ingreso" : "Nuevo egreso"}</DialogTitle>
          <DialogDescription>Registra un movimiento de caja en la moneda seleccionada.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input value={currencyCode ?? ""} disabled className="h-11" />
          <label className="grid gap-2 text-sm font-medium">
            Monto
            <LocalDecimalInput value={form.amount} onChange={form.setAmount} decimalScale={2} className="h-11" />
          </label>
          {form.negativeBalanceWarning ? (
            <div className="rounded-[8px] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <p className="font-medium">Esta operacion dejara un balance negativo en el sistema.</p>
              <p className="mt-1 text-xs">
                Saldo actual: {form.negativeBalanceWarning.currentBalance} · Saldo estimado:{" "}
                {form.negativeBalanceWarning.projectedBalance}
              </p>
            </div>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Categoria
            <Select value={form.categoryValue} onValueChange={form.setCategoryValue}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoria</SelectItem>
                {form.categories.map((category) => (
                  <SelectItem key={`${category.origin}:${category.id}`} value={`${category.origin}:${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Descripcion
            <Input value={form.description} onChange={(event) => form.setDescription(event.target.value)} className="h-11" />
          </label>
          {form.mutation.error ? <p className="text-sm text-destructive">{form.mutation.error.message}</p> : null}
          <CashboxDialogActions loading={form.mutation.isPending} onCancel={() => setOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
