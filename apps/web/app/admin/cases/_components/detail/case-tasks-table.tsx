"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Columns3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../../../_constants/dashboard";
import {
  caseTasksTableColumnLabels,
  caseTaskStatusLabels,
  defaultCaseTasksTableColumns
} from "../../_constants/cases.constants";
import { useCaseTasksQuery } from "../../_hooks/use-case-tasks-query";
import type { CaseTaskDto, CaseTasksTableColumn } from "../../_types/cases.types";
import { formatCaseDate, getTaskStatusClassName } from "./case-detail-format";
import { CaseTaskRowActions } from "./case-task-row-actions";
import { CaseTaskSheet } from "./case-task-sheet";

const allCaseTasksTableColumns = Object.keys(caseTasksTableColumnLabels) as CaseTasksTableColumn[];

export function CaseTasksTable({
  canCreate,
  canCreateExpense,
  canDelete,
  canDeleteExpense,
  canReadExpense,
  canUpdate,
  canUpdateExpense,
  caseId
}: {
  canCreate: boolean;
  canCreateExpense: boolean;
  canDelete: boolean;
  canDeleteExpense: boolean;
  canReadExpense: boolean;
  canUpdate: boolean;
  canUpdateExpense: boolean;
  caseId: string;
}) {
  const hasActions = canDelete || canUpdate || canCreateExpense || canReadExpense;
  const tasksQuery = useCaseTasksQuery(caseId);
  const tasks = tasksQuery.data?.items ?? [];
  const hasNextPage = Boolean(tasksQuery.data?.pageInfo.hasNextPage);
  const [visibleColumns, setVisibleColumns] = useState<CaseTasksTableColumn[]>([
    ...defaultCaseTasksTableColumns
  ]);
  const columnCount = visibleColumns.length + (hasActions ? 1 : 0);

  function toggleColumn(column: CaseTasksTableColumn, checked: boolean) {
    const nextColumns = checked
      ? [...new Set([...visibleColumns, column])]
      : visibleColumns.filter((item) => item !== column);

    setVisibleColumns(nextColumns.length ? nextColumns : [...defaultCaseTasksTableColumns]);
  }

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-[320px] flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-3 border-b border-border/30 px-4 py-4 md:gap-4 md:px-6 md:py-5">
        <div className="min-w-0">
          <CardTitle
            className={`text-base font-semibold md:text-lg ${adminSurfacePrimaryClassName}`}
          >
            Tareas del expediente
          </CardTitle>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            Seguimiento operativo, fechas y observaciones del expediente.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-2 rounded-lg border-border/50 px-3"
              >
                <Columns3 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Columnas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allCaseTasksTableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.includes(column)}
                  key={column}
                  onCheckedChange={(value) => toggleColumn(column, Boolean(value))}
                >
                  {caseTasksTableColumnLabels[column]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {canCreate ? (
            <CaseTaskSheet
              caseId={caseId}
              trigger={
                <Button type="button" className="h-9 gap-2 px-3">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Nueva tarea</span>
                </Button>
              }
            />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-2xl">
          <Table className="min-w-full text-xs">
            <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                {visibleColumns.map((column) => (
                  <TableHead className="h-11 px-4 text-sm font-medium text-foreground" key={column}>
                    {caseTasksTableColumnLabels[column]}
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
              {tasksQuery.isLoading ? (
                <TaskRowsSkeleton columnCount={columnCount} />
              ) : tasksQuery.error ? (
                <TableRow className="h-[260px] hover:bg-transparent">
                  <TableCell
                    className="px-4 py-10 text-center text-sm font-medium text-destructive"
                    colSpan={columnCount}
                  >
                    {tasksQuery.error.message}
                  </TableCell>
                </TableRow>
              ) : !tasksQuery.hasPermission ? (
                <TableRow className="h-[260px] hover:bg-transparent">
                  <TableCell
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                    colSpan={columnCount}
                  >
                    No tenes permisos para ver las tareas de este expediente.
                  </TableCell>
                </TableRow>
              ) : tasks.length ? (
                tasks.map((task) => (
                  <TableRow
                    className="h-[70px] border-border/40 hover:bg-secondary/30"
                    key={task.id}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell className="px-4 py-4" key={column}>
                        {renderTaskTableCell(column, task)}
                      </TableCell>
                    ))}
                    {hasActions ? (
                      <TableCell className="px-4 py-4 text-right">
                        <div className="flex justify-end">
                          <CaseTaskRowActions
                            canCreateExpense={canCreateExpense}
                            canDelete={canDelete}
                            canDeleteExpense={canDeleteExpense}
                            canReadExpense={canReadExpense}
                            canUpdate={canUpdate}
                            canUpdateExpense={canUpdateExpense}
                            caseId={caseId}
                            task={task}
                          />
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-[260px] hover:bg-transparent">
                  <TableCell
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                    colSpan={columnCount}
                  >
                    Todavia no hay tareas cargadas para este expediente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/30 py-3 text-sm text-muted-foreground">
          <span>
            Pagina {tasksQuery.pageIndex + 1} - {tasks.length} tareas
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded-lg border-border/50 p-0"
              disabled={!tasksQuery.canGoBack}
              onClick={tasksQuery.goBack}
              aria-label="Pagina anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded-lg border-border/50 p-0"
              disabled={!hasNextPage}
              onClick={tasksQuery.goForward}
              aria-label="Pagina siguiente"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskRowsSkeleton({ columnCount }: { columnCount: number }) {
  return Array.from({ length: 4 }).map((_, rowIndex) => (
    <TableRow className="h-[70px] border-border/40 hover:bg-transparent" key={rowIndex}>
      {Array.from({ length: columnCount }).map((__, cellIndex) => (
        <TableCell className="px-4 py-4" key={cellIndex}>
          <div className="h-4 rounded bg-muted/60" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function renderTaskTableCell(column: CaseTasksTableColumn, task: CaseTaskDto) {
  const cellRenderMap: Record<CaseTasksTableColumn, ReactNode> = {
    name: <span className="font-medium text-foreground">{task.name}</span>,
    startDate: (
      <span className="text-sm text-muted-foreground">{formatCaseDate(task.startDate)}</span>
    ),
    endDate: <span className="text-sm text-muted-foreground">{formatCaseDate(task.endDate)}</span>,
    status: (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getTaskStatusClassName(
          task.status
        )}`}
      >
        {caseTaskStatusLabels[task.status]}
      </span>
    ),
    notes: (
      <span className="block max-w-[280px] truncate text-sm text-muted-foreground">
        {task.notes || "Sin observaciones"}
      </span>
    )
  };

  return cellRenderMap[column];
}
