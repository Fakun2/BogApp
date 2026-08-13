import type { CurrencyStatusFilter, CurrencyTableColumn } from "../_types/currencies.types";

export const currencyTablePageSize = 12;
export const availableCurrenciesLimit = 100;
export const allCurrencyStatusFilterValue: CurrencyStatusFilter = "all";

export const currencyTableColumnLabels: Record<CurrencyTableColumn, string> = {
  active: "Estado",
  code: "Codigo",
  name: "Nombre",
  symbol: "Abreviacion"
};

export const currencyTableDefaultColumns: CurrencyTableColumn[] = [
  "name",
  "code",
  "symbol",
  "active"
];

export const currencyTableCellClassNameByColumn: Record<string, string> = {
  actions: "h-12 w-24 px-3 py-2",
  active: "h-12 min-w-[120px] px-3 py-2",
  code: "h-12 min-w-[120px] px-3 py-2",
  name: "h-12 min-w-[240px] px-3 py-2",
  symbol: "h-12 min-w-[140px] px-3 py-2"
};

export const currencyTableHeaderClassNameByColumn: Record<string, string> = {
  actions: "w-24",
  active: "min-w-[120px]",
  code: "min-w-[120px]",
  name: "min-w-[240px]",
  symbol: "min-w-[140px]"
};
