import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import {
  categoryKindLabels,
  categoryOriginLabels,
  categoryTableCellClassNameByColumn,
  categoryTableColumnLabels
} from "../../../_constants/category.constants";
import type {
  CategoryDto,
  CategorySortDirection,
  CategorySortKey,
  CategoryTableColumn
} from "../../../_types/categories.types";
import { CategoryRowActions } from "../actions/category-row-actions";
import { isCategorySortKey, SortableColumnHeader } from "./sortable-column-header";
import { StatusPill } from "./status-pill";

export function getCategoryTableColumns({
  sortDirection,
  sortKey,
  onMutationSuccess,
  onSort
}: {
  sortDirection: CategorySortDirection;
  sortKey: CategorySortKey;
  onMutationSuccess: () => void;
  onSort: (key: CategorySortKey) => void;
}): Array<ColumnDef<CategoryDto>> {
  const columns: Array<ColumnDef<CategoryDto>> = (
    Object.keys(categoryTableColumnLabels) as CategoryTableColumn[]
  ).map((column) => ({
    id: column,
    accessorFn: (category) => getCategoryAccessorValue(category, column),
    header: () =>
      isCategorySortKey(column) ? (
        <SortableColumnHeader
          active={sortKey === column}
          direction={sortDirection}
          label={categoryTableColumnLabels[column]}
          onClick={() => onSort(column)}
        />
      ) : (
        categoryTableColumnLabels[column]
      ),
    cell: ({ row }) => renderCategoryCell(row.original, column)
  }));

  columns.push({
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    header: "Acciones",
    cell: ({ row }) => <CategoryRowActions category={row.original} onSuccess={onMutationSuccess} />
  });

  return columns;
}

export function CategoryDataTableCell({
  children,
  columnId
}: {
  children: ReactNode;
  columnId: string;
}) {
  return (
    <TableCell className={categoryTableCellClassNameByColumn[columnId] ?? "h-12 px-3 py-2"}>
      {children}
    </TableCell>
  );
}

function renderCategoryCell(category: CategoryDto, column: CategoryTableColumn) {
  const cellRenderMap: Record<CategoryTableColumn, ReactNode> = {
    active: <StatusPill active={category.active} />,
    kind: <Badge variant="outline">{categoryKindLabels[category.kind]}</Badge>,
    name: (
      <span className="grid gap-0.5">
        <span className="font-medium text-foreground">{category.name}</span>
        {category.code ? (
          <span className="text-[11px] text-muted-foreground">{category.code}</span>
        ) : null}
      </span>
    ),
    origin: (
      <Badge variant={category.origin === "global" ? "secondary" : "outline"}>
        {categoryOriginLabels[category.origin]}
      </Badge>
    )
  };

  return cellRenderMap[column];
}

function getCategoryAccessorValue(category: CategoryDto, column: CategoryTableColumn) {
  const accessorMap: Record<CategoryTableColumn, string | boolean> = {
    active: category.active,
    kind: category.kind,
    name: category.name,
    origin: category.origin
  };

  return accessorMap[column];
}
