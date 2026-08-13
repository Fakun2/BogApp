"use client";

import { useEffect, useMemo, useState } from "react";
import { Columns3, Plus } from "lucide-react";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { casesTableColumnLabels, defaultCasesTableColumns } from "../../_constants/cases.constants";
import type { CaseFiltersDraft } from "../../_types/case-filter.types";
import type { CaseSortDirection, CaseSortKey, CasesTableColumn } from "../../_types/cases.types";
import { emptyCaseFilters } from "../../_utils/case-filter-options";
import { allCasesTableColumns, serializeCasesTableColumns } from "../../_utils/case-table-columns";
import { CaseSheet } from "../sheet/case-sheet";
import { CaseFiltersPopover } from "./case-filters-popover";
import { CaseSortMenu } from "./case-sort-menu";

export function CasesTableToolbar({
  canCreate,
  columns,
  filters,
  onColumnsChange,
  onFiltersChange,
  onSort,
  sortBy,
  sortDirection
}: {
  canCreate: boolean;
  columns: CasesTableColumn[];
  filters: CaseFiltersDraft;
  onColumnsChange: (columns: CasesTableColumn[]) => void;
  onFiltersChange: (filters: CaseFiltersDraft) => void;
  onSort: (sortBy: CaseSortKey) => void;
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
}) {
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const columnsKey = useMemo(() => serializeCasesTableColumns(columns), [columns]);

  useEffect(() => {
    setVisibleColumns(columns);
  }, [columns, columnsKey]);

  function toggleColumn(column: CasesTableColumn, checked: boolean) {
    const nextColumns = checked
      ? [...new Set([...visibleColumns, column])]
      : visibleColumns.filter((item) => item !== column);
    const normalizedColumns = nextColumns.length ? nextColumns : [...defaultCasesTableColumns];

    setVisibleColumns(normalizedColumns);
    onColumnsChange(normalizedColumns);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCreate ? (
        <CaseSheet
          trigger={<AdminTableHeaderActionButton icon={Plus} label="Nuevo" tone="primary" />}
        />
      ) : null}
      <CaseFiltersPopover
        disabled={false}
        filters={filters}
        onApply={onFiltersChange}
        onReset={() => onFiltersChange(emptyCaseFilters)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AdminTableHeaderActionButton icon={Columns3} label="Columnas" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allCasesTableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes(column)}
              key={column}
              onCheckedChange={(value) => toggleColumn(column, Boolean(value))}
            >
              {casesTableColumnLabels[column]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CaseSortMenu sortBy={sortBy} sortDirection={sortDirection} onSort={onSort} />
    </div>
  );
}
