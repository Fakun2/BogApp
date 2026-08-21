import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { TableCell } from "@/components/ui/table";
import {
  currencyTableCellClassNameByColumn,
  currencyTableColumnLabels
} from "../../../_constants/currency.constants";
import type {
  CurrencyDto,
  CurrencySortDirection,
  CurrencySortKey,
  CurrencyTableColumn
} from "../../../_types/currencies.types";
import { CurrencyRowActions } from "../actions/currency-row-actions";
import { isCurrencySortKey, SortableColumnHeader } from "./sortable-column-header";
import { StatusPill } from "./status-pill";

export function getCurrencyTableColumns({
  canManageCurrencies,
  sortDirection,
  sortKey,
  onSort
}: {
  canManageCurrencies: boolean;
  sortDirection: CurrencySortDirection;
  sortKey: CurrencySortKey;
  onSort: (key: CurrencySortKey) => void;
}): Array<ColumnDef<CurrencyDto>> {
  const columns: Array<ColumnDef<CurrencyDto>> = (
    Object.keys(currencyTableColumnLabels) as CurrencyTableColumn[]
  ).map((column) => ({
    id: column,
    accessorFn: (currency) => getCurrencyAccessorValue(currency, column),
    header: () =>
      isCurrencySortKey(column) ? (
        <SortableColumnHeader
          active={sortKey === column}
          direction={sortDirection}
          label={currencyTableColumnLabels[column]}
          onClick={() => onSort(column)}
        />
      ) : (
        currencyTableColumnLabels[column]
      ),
    cell: ({ row }) => renderCurrencyCell(row.original, column)
  }));

  if (canManageCurrencies) {
    columns.push({
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      header: "Acciones",
      cell: ({ row }) => <CurrencyRowActions currency={row.original} />
    });
  }

  return columns;
}

export function CurrencyDataTableCell({
  children,
  columnId
}: {
  children: ReactNode;
  columnId: string;
}) {
  return (
    <TableCell className={currencyTableCellClassNameByColumn[columnId] ?? "h-12 px-3 py-2"}>
      {children}
    </TableCell>
  );
}

function renderCurrencyCell(currency: CurrencyDto, column: CurrencyTableColumn) {
  const cellRenderMap: Record<CurrencyTableColumn, ReactNode> = {
    active: <StatusPill active={currency.active} />,
    code: (
      <span className="font-mono text-xs font-semibold text-muted-foreground">{currency.code}</span>
    ),
    name: (
      <span className="block truncate text-sm font-medium text-foreground">{currency.name}</span>
    ),
    symbol: <span className="block truncate text-sm text-foreground">{currency.symbol}</span>
  };

  return cellRenderMap[column];
}

function getCurrencyAccessorValue(currency: CurrencyDto, column: CurrencyTableColumn) {
  const accessorMap: Record<CurrencyTableColumn, string | boolean> = {
    active: currency.active,
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol
  };

  return accessorMap[column];
}
