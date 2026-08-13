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
import { categoryTableColumnLabels } from "../../../_constants/category.constants";
import type { CategoryDto, CategoryTableColumn } from "../../../_types/categories.types";

export function CategoryTableViewOptions({ table }: { table: Table<CategoryDto> }) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && isCategoryTableColumn(column.id));
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
            {categoryTableColumnLabels[column.id as CategoryTableColumn]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function isCategoryTableColumn(columnId: string): columnId is CategoryTableColumn {
  return columnId === "active" || columnId === "kind" || columnId === "name" || columnId === "origin";
}
