"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeftRight, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const cashboxConversionFieldClassName =
  "h-12 rounded-2xl border-border/40 bg-card px-4 shadow-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10";
const cashboxConversionSelectClassName =
  "!h-12 w-full rounded-2xl border-border/40 bg-card px-4 shadow-none focus:border-ring/40 focus:ring-2 focus:ring-ring/10";

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
            <CurrencySelect
              label="Origen"
              value={form.fromCurrencyCode}
              currencies={currencies}
              onChange={form.setFromCurrencyCode}
            />
            <CurrencySelect
              label="Destino"
              value={form.toCurrencyCode}
              currencies={currencies}
              onChange={form.setToCurrencyCode}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ConversionField label="Monto origen">
              <LocalDecimalInput
                value={form.fromAmount}
                onChange={form.setFromAmount}
                decimalScale={2}
                className={cashboxConversionFieldClassName}
              />
            </ConversionField>
            <ConversionField label="Monto destino">
              <Input value={form.toAmount} disabled className={cashboxConversionFieldClassName} />
            </ConversionField>
          </div>
          <div className="grid gap-2">
            <Label>Cotizacion</Label>
            <div className="grid items-end gap-2 sm:grid-cols-[0.6fr_1fr_0.6fr_auto]">
              <CurrencySelect
                label="1"
                value={form.quoteBaseCurrencyCode}
                currencies={getPairCurrencies(currencies, form.fromCurrencyCode, form.toCurrencyCode)}
                onChange={form.setQuoteBaseCurrencyCode}
              />
              <ConversionField label="Vale">
                <LocalDecimalInput
                  value={form.quoteRate}
                  onChange={form.setQuoteRate}
                  decimalScale={8}
                  className={cashboxConversionFieldClassName}
                />
              </ConversionField>
              <CurrencySelect
                label="En"
                value={form.quoteCounterCurrencyCode}
                currencies={getPairCurrencies(currencies, form.fromCurrencyCode, form.toCurrencyCode)}
                onChange={form.setQuoteCounterCurrencyCode}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 self-center rounded-xl border-border/40 bg-card shadow-none hover:bg-secondary/60 sm:mb-1.5 sm:self-end"
                onClick={form.invertQuote}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ConversionField label="Descripcion">
            <Input
              value={form.description}
              onChange={(event) => form.setDescription(event.target.value)}
              className={cashboxConversionFieldClassName}
            />
          </ConversionField>
          {form.balanceError || form.mutation.error ? (
            <p className="text-sm text-destructive">{form.balanceError ?? form.mutation.error?.message}</p>
          ) : null}
          <CashboxDialogActions loading={form.mutation.isPending} onCancel={() => setOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConversionField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function getPairCurrencies(currencies: CurrencyDto[], fromCurrencyCode: string, toCurrencyCode: string) {
  const pairCodes = new Set([fromCurrencyCode, toCurrencyCode]);
  return currencies.filter((currency) => pairCodes.has(currency.code));
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
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cashboxConversionSelectClassName}>
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
    </div>
  );
}
