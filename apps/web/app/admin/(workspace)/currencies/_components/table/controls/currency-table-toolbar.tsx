import type { Table } from "@tanstack/react-table";
import { Can } from "../../../../_components/auth";
import type {
  CurrencyDto,
  CurrencySortDirection,
  CurrencySortKey,
  CurrencyStatusFilter
} from "../../../_types/currencies.types";
import { AddCurrenciesDialog } from "../add-currencies-dialog";
import { CurrencySortMenu } from "./currency-sort-menu";
import { CurrencyTableViewOptions } from "./currency-table-view-options";

export function CurrencyTableToolbar({
  sortDirection,
  sortKey,
  table,
  onAddSuccess,
  onSort,
}: {
  search: string;
  sortDirection: CurrencySortDirection;
  sortKey: CurrencySortKey;
  status: CurrencyStatusFilter;
  table: Table<CurrencyDto>;
  onAddSuccess: () => void;
  onSearchChange: (search: string) => void;
  onSort: (key: CurrencySortKey) => void;
  onStatusChange: (status: CurrencyStatusFilter) => void;
}) {
  return (
    <>
      <Can permissions={["finance:update"]}>
        <AddCurrenciesDialog onSuccess={onAddSuccess} />
      </Can>
      <CurrencySortMenu sortDirection={sortDirection} sortKey={sortKey} onSort={onSort} />
      <CurrencyTableViewOptions table={table} />
    </>
  );
}
