"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  caseStatusLabels,
  casesPageSize,
  casesTableColumnLabels
} from "../../_constants/cases.constants";
import type {
  CaseDto,
  CaseSortDirection,
  CaseSortKey,
  CasesTableColumn
} from "../../_types/cases.types";
import { CaseRowActions } from "./case-row-actions";
import { CaseSortableColumnHeader } from "./case-sortable-column-header";
import { TableStateRow } from "./table-state-row";

export function CasesTable({
  canDelete,
  canUpdate,
  cases,
  columns,
  error,
  sortBy,
  sortDirection
}: {
  canDelete: boolean;
  canUpdate: boolean;
  cases: CaseDto[];
  columns: CasesTableColumn[];
  error: Error | null;
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const hasActions = true;
  const columnCount = columns.length + 1 + (hasActions ? 1 : 0);
  const fillerRows = Math.max(0, casesPageSize - cases.length);
  const pageCaseIds = useMemo(() => cases.map((item) => item.id), [cases]);
  const selectedPageCount = pageCaseIds.filter((id) => selectedIds.has(id)).length;
  const allPageRowsSelected = cases.length > 0 && selectedPageCount === cases.length;
  const somePageRowsSelected = selectedPageCount > 0 && selectedPageCount < cases.length;

  useEffect(() => {
    setSelectedIds((current) => new Set([...current].filter((id) => pageCaseIds.includes(id))));
  }, [pageCaseIds]);

  function toggleAllPageRows(checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const id of pageCaseIds) {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }
      return next;
    });
  }

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  if (error) {
    return <TableStateRow text={error.message} />;
  }

  if (cases.length === 0) {
    return <TableStateRow text="Todavia no hay expedientes cargados." />;
  }

  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-2xl">
      <Table className="min-w-full text-xs">
        <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 w-10 px-4 text-sm font-medium text-foreground">
              <Checkbox
                checked={allPageRowsSelected || (somePageRowsSelected ? "indeterminate" : false)}
                onCheckedChange={(value) => toggleAllPageRows(Boolean(value))}
                aria-label="Seleccionar todos los expedientes de la pagina"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead className="h-11 px-4 text-sm font-medium text-foreground" key={column}>
                {renderCaseTableHeader({
                  activeSortKey: sortBy,
                  column,
                  direction: sortDirection
                })}
              </TableHead>
            ))}
            {hasActions ? (
              <TableHead className="h-11 px-4 text-right text-sm font-medium text-foreground">
                Acciones
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-0">
          {cases.map((item) => (
            <TableRow className="h-[70px] border-border/40 hover:bg-secondary/30" key={item.id}>
              <TableCell className="w-10 px-4 py-4">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={(value) => toggleRow(item.id, Boolean(value))}
                  aria-label={`Seleccionar ${item.caseNumber}`}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell className="px-4 py-4" key={column}>
                  {renderCaseTableCell(column, item)}
                </TableCell>
              ))}
              {hasActions ? (
                <TableCell className="px-4 py-4 text-right">
                  <div className="flex justify-end">
                    <CaseRowActions canDelete={canDelete} canUpdate={canUpdate} caseItem={item} />
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
          {Array.from({ length: fillerRows }).map((_, index) => (
            <TableRow
              aria-hidden="true"
              className="h-[70px] border-border/40 hover:bg-transparent"
              key={`case-filler-${index}`}
            >
              <TableCell className="px-4 py-4" colSpan={columnCount}>
                <span className="sr-only">Fila vacia</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function renderCaseTableHeader({
  activeSortKey,
  column,
  direction
}: {
  activeSortKey: CaseSortKey;
  column: CasesTableColumn;
  direction: CaseSortDirection;
}) {
  const sortableColumnMap: Partial<Record<CasesTableColumn, CaseSortKey>> = {
    caption: "caption",
    caseNumber: "caseNumber",
    status: "status"
  };
  const sortKey = sortableColumnMap[column];

  if (!sortKey) {
    return casesTableColumnLabels[column];
  }

  return (
    <CaseSortableColumnHeader
      active={activeSortKey === sortKey}
      direction={direction}
      label={casesTableColumnLabels[column]}
      sortKey={sortKey}
    />
  );
}

function renderCaseTableCell(column: CasesTableColumn, item: CaseDto) {
  const cellRenderMap: Record<CasesTableColumn, ReactNode> = {
    caseNumber: <span className="font-medium text-foreground">{item.caseNumber}</span>,
    caption: (
      <span className="block min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{item.caption}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {item.subject || "Sin asunto"}
        </span>
      </span>
    ),
    court: <NullableText value={item.court} />,
    forum: <NullableText value={item.forum.name} />,
    judicialCenter: <NullableText value={item.judicialCenter?.name ?? item.judicialCenterText} />,
    province: <NullableText value={item.province.name} />,
    status: <span className="text-sm text-foreground">{caseStatusLabels[item.status]}</span>
  };

  return cellRenderMap[column];
}

function NullableText({ value }: { value: string | null | undefined }) {
  return (
    <span className={value ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
      {value || "Sin cargar"}
    </span>
  );
}
