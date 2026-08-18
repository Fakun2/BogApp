"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import { AdminTableRowsSkeleton } from "../../../_components/admin-skeletons";
import { availableCurrenciesLimit } from "../../_constants/currency.constants";
import {
  useAddTenantCurrenciesMutation,
  useAvailableTenantCurrenciesQuery
} from "../../_hooks/use-currencies-query";
import type { CurrencyDto } from "../../_types/currencies.types";
import { StateBox } from "./states/state-box";

export function AddCurrenciesDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const availableQuery = useAvailableTenantCurrenciesQuery({
    limit: availableCurrenciesLimit,
    search
  });
  const addMutation = useAddTenantCurrenciesMutation();
  const currencies = availableQuery.data?.items ?? [];
  const selectedCount = selectedCodes.length;
  const selectedCodesSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);
  const allSelected =
    currencies.length > 0 && currencies.every((currency) => selectedCodesSet.has(currency.code));
  const someSelected = currencies.some((currency) => selectedCodesSet.has(currency.code));

  function toggleCurrency(code: string) {
    setSelectedCodes((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
    );
  }

  function toggleAllCurrencies() {
    if (allSelected) {
      setSelectedCodes((current) =>
        current.filter((code) => !currencies.some((currency) => currency.code === code))
      );
      return;
    }

    setSelectedCodes((current) => [
      ...new Set([...current, ...currencies.map((currency) => currency.code)])
    ]);
  }

  function closeDialog(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
      setSelectedCodes([]);
    }
  }

  async function submit() {
    if (selectedCodes.length === 0) {
      return;
    }

    await addMutation.mutateAsync({ currencyCodes: selectedCodes });
    closeDialog(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <AdminTableHeaderActionButton icon={Plus} label="Anadir" tone="primary" />
      </DialogTrigger>
      <DialogContent className="max-h-[86svh] max-w-2xl grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden p-0">
        <DialogHeader className="px-5 pb-0 pt-5">
          <DialogTitle>Anadir monedas al estudio</DialogTitle>
          <DialogDescription>
            Selecciona una o varias monedas disponibles para habilitarlas en caja.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5">
          <Input
            aria-label="Buscar monedas disponibles"
            className="h-10 rounded-md border-border/40 bg-card"
            placeholder="Buscar moneda"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="min-h-0 overflow-hidden border-y border-border/30">
          <AvailableCurrenciesTable
            allSelected={allSelected}
            currencies={currencies}
            error={availableQuery.error}
            loading={availableQuery.isLoading}
            selectedCodes={selectedCodesSet}
            someSelected={someSelected}
            onToggleAll={toggleAllCurrencies}
            onToggleCurrency={toggleCurrency}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-3">
          <span className="text-xs text-muted-foreground">
            {selectedCount} seleccionada{selectedCount === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-md"
              onClick={() => closeDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              className="h-9 rounded-md"
              disabled={selectedCount === 0 || addMutation.isPending}
              type="button"
              onClick={submit}
            >
              {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Anadir seleccionadas
            </Button>
          </div>
        </div>
        {addMutation.error ? (
          <div className="border-t border-border/30 px-5 py-2 text-xs text-destructive">
            {addMutation.error.message}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AvailableCurrenciesTable({
  allSelected,
  currencies,
  error,
  loading,
  selectedCodes,
  someSelected,
  onToggleAll,
  onToggleCurrency
}: {
  allSelected: boolean;
  currencies: CurrencyDto[];
  error: Error | null;
  loading: boolean;
  selectedCodes: Set<string>;
  someSelected: boolean;
  onToggleAll: () => void;
  onToggleCurrency: (code: string) => void;
}) {
  if (loading) {
    return (
      <div className="h-full max-h-[46svh] overflow-hidden">
        <Table>
          <TableBody>
            <AdminTableRowsSkeleton columnCount={4} rowCount={availableCurrenciesLimit} />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <StateBox icon={<XCircle className="h-4 w-4" />} text={error.message} tone="error" />;
  }

  if (currencies.length === 0) {
    return <StateBox text="No hay monedas disponibles para agregar." />;
  }

  return (
    <div className="h-full max-h-[46svh] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-[var(--dropdown-bg)]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                aria-label="Seleccionar todas las monedas disponibles"
                checked={allSelected || (someSelected ? "indeterminate" : false)}
                onCheckedChange={onToggleAll}
              />
            </TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-28">Codigo</TableHead>
            <TableHead className="w-32">Abreviacion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => {
            const selected = selectedCodes.has(currency.code);

            return (
              <TableRow
                key={currency.id}
                data-state={selected ? "selected" : undefined}
                className="cursor-pointer border-border/30"
                onClick={() => onToggleCurrency(currency.code)}
              >
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    aria-label={`Seleccionar ${currency.name}`}
                    checked={selected}
                    onCheckedChange={() => onToggleCurrency(currency.code)}
                  />
                </TableCell>
                <TableCell>
                  <span className="block truncate font-medium text-foreground">
                    {currency.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {currency.code}
                  </span>
                </TableCell>
                <TableCell>{currency.symbol}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
