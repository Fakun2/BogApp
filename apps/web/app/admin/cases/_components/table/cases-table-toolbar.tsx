"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  casesTableColumnLabels,
  defaultCasesTableColumns
} from "../../_constants/cases.constants";
import type { CaseFiltersDraft } from "../../_types/case-filter.types";
import type {
  CaseSortDirection,
  CaseSortKey,
  CasesTableColumn
} from "../../_types/cases.types";
import { emptyCaseFilters, toCaseFilterQueryUpdates } from "../../_utils/case-filter-options";
import { allCasesTableColumns, serializeCasesTableColumns } from "../../_utils/case-table-columns";
import { CaseSheet } from "../sheet/case-sheet";
import { CaseFiltersPopover } from "./case-filters-popover";
import { CaseSortMenu } from "./case-sort-menu";

export function CasesTableToolbar({
  canCreate,
  columns,
  filters,
  sortBy,
  sortDirection
}: {
  canCreate: boolean;
  columns: CasesTableColumn[];
  filters: CaseFiltersDraft;
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const columnsKey = useMemo(() => serializeCasesTableColumns(columns), [columns]);

  useEffect(() => {
    setVisibleColumns(columns);
  }, [columns, columnsKey]);

  function updateQuery(updates: Record<string, string | null>, options = { resetPagination: true }) {
    const nextParams = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    }

    if (options.resetPagination) {
      nextParams.delete("cursor");
      nextParams.delete("cursorStack");
    }
    startTransition(() => {
      const query = nextParams.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function toggleColumn(column: CasesTableColumn, checked: boolean) {
    const nextColumns = checked
      ? [...new Set([...visibleColumns, column])]
      : visibleColumns.filter((item) => item !== column);
    const normalizedColumns = nextColumns.length ? nextColumns : [...defaultCasesTableColumns];

    setVisibleColumns(normalizedColumns);
    updateQuery(
      {
        columns: serializeCasesTableColumns(normalizedColumns)
      },
      { resetPagination: false }
    );
  }

  function updateSort(key: CaseSortKey) {
    updateQuery({
      sortBy: key,
      sortDirection: sortBy === key && sortDirection === "asc" ? "desc" : "asc"
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCreate ? (
        <CaseSheet
          trigger={<AdminTableHeaderActionButton icon={Plus} label="Nuevo" tone="primary" />}
        />
      ) : null}
      <CaseFiltersPopover
        disabled={isPending}
        filters={filters}
        onApply={(nextFilters) => updateQuery(toCaseFilterQueryUpdates(nextFilters))}
        onReset={() => updateQuery(toCaseFilterQueryUpdates(emptyCaseFilters))}
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
              disabled={isPending}
              key={column}
              onCheckedChange={(value) => toggleColumn(column, Boolean(value))}
            >
              {casesTableColumnLabels[column]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CaseSortMenu sortBy={sortBy} sortDirection={sortDirection} onSort={updateSort} />
    </div>
  );
}
