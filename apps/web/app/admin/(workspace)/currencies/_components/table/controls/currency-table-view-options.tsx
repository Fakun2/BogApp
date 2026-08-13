import type { Table } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { currencyTableColumnLabels } from "../../../_constants/currency.constants";
import type { CurrencyDto, CurrencyTableColumn } from "../../../_types/currencies.types";

export function CurrencyTableViewOptions({ table }: { table: Table<CurrencyDto> }) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && isCurrencyTableColumn(column.id));
  const visibleColumnsCount = table.getVisibleFlatColumns().length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={Columns3} label="Columnas" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={column.getIsVisible()}
            disabled={column.getIsVisible() && visibleColumnsCount === 1}
            key={column.id}
            onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
          >
            {currencyTableColumnLabels[column.id as CurrencyTableColumn]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function isCurrencyTableColumn(columnId: string): columnId is CurrencyTableColumn {
  return columnId === "active" || columnId === "code" || columnId === "name" || columnId === "symbol";
}
