"use client";

import { useState, type FormEvent } from "react";
import { Repeat2 } from "lucide-react";
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
import type { CurrencyDto } from "../../currencies/_types/currencies.types";
import { useCashboxConversionForm } from "../_hooks/use-cashbox-conversion-form";
import { CashboxDialogActions } from "./cashbox-dialog-actions";
import { LocalDecimalInput } from "./local-decimal-input";

export function CashboxConversionDialog({
  currencies,
  selectedBalance,
  selectedCurrencyCode,
  onSuccess
}: {
  currencies: CurrencyDto[];
  selectedBalance: string;
  selectedCurrencyCode?: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useCashboxConversionForm({
    currencies,
    selectedBalance,
    selectedCurrencyCode,
    onSuccess
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const submitted = await form.handleSubmit(event);
    setOpen(!submitted);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      form.prepareCurrencyDefaults();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AdminTableHeaderActionButton icon={Repeat2} label="Conversion" onClick={() => setOpen(true)} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva conversion</DialogTitle>
          <DialogDescription>Registra un swap entre dos monedas activas del estudio.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <CurrencySelect label="Origen" value={form.fromCurrencyCode} currencies={currencies} onChange={form.setFromCurrencyCode} />
            <CurrencySelect label="Destino" value={form.toCurrencyCode} currencies={currencies} onChange={form.setToCurrencyCode} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium">
              Monto origen
              <LocalDecimalInput value={form.fromAmount} onChange={form.setFromAmount} decimalScale={2} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tipo de cambio
              <LocalDecimalInput value={form.exchangeRate} onChange={form.setExchangeRate} decimalScale={8} className="h-11" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Monto destino
              <Input value={form.toAmount} disabled className="h-11" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Descripcion
            <Input value={form.description} onChange={(event) => form.setDescription(event.target.value)} className="h-11" />
          </label>
          {form.balanceError || form.mutation.error ? (
            <p className="text-sm text-destructive">{form.balanceError ?? form.mutation.error?.message}</p>
          ) : null}
          <CashboxDialogActions loading={form.mutation.isPending} onCancel={() => setOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CurrencySelect({
  currencies,
  label,
  value,
  onChange
}: {
  currencies: CurrencyDto[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue placeholder="Moneda" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.code} · {currency.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
