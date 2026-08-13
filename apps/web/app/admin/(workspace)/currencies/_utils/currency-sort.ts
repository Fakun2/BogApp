import type {
  CurrencySortDirection,
  CurrencySortKey,
  TenantCurrencySort
} from "../_types/currencies.types";

export function toTenantCurrencySort(
  sortKey: CurrencySortKey,
  sortDirection: CurrencySortDirection
): TenantCurrencySort {
  return `${sortKey}:${sortDirection}`;
}
