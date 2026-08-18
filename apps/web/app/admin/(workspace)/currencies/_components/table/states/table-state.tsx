import type { CurrencyDto } from "../../../_types/currencies.types";
import { AdminTableRowsSkeleton } from "../../../../_components/admin-skeletons";
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
    return <AdminTableRowsSkeleton columnCount={columnCount} rowCount={8} />;
  }

  if (error) {
    return <StateRow columnCount={columnCount} message={error.message} tone="error" />;
  }

  if (currencies.length === 0) {
    return <StateRow columnCount={columnCount} message="Todavia no hay monedas habilitadas." />;
  }

  return null;
}
