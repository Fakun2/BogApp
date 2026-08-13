import type { CurrencyDto } from "../../../_types/currencies.types";
import { StateRow } from "./state-row";

export function CurrencyTableState({
  columnCount,
  currencies,
  error,
  loading
}: {
  columnCount: number;
  currencies: CurrencyDto[];
  error: Error | null;
  loading: boolean;
}) {
  if (loading && currencies.length === 0) {
    return <StateRow columnCount={columnCount} fill message="Cargando monedas..." />;
  }

  if (error) {
    return <StateRow columnCount={columnCount} message={error.message} tone="error" />;
  }

  if (currencies.length === 0) {
    return <StateRow columnCount={columnCount} message="Todavia no hay monedas habilitadas." />;
  }

  return null;
}
