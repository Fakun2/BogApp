import type { ReactNode } from "react";
import { caseTaskStatusLabels } from "../../../_constants/cases.constants";
import type { CaseTaskDto, CaseTasksTableColumn } from "../../../_types/cases.types";
import { formatCaseDate, formatCaseDateTime, getTaskStatusClassName } from "../case-detail-format";

export function TaskTableCell({
  column,
  task
}: {
  column: CaseTasksTableColumn;
  task: CaseTaskDto;
}) {
  const cellRenderMap: Record<CaseTasksTableColumn, ReactNode> = {
    assignedTo: (
      <span className="text-sm text-muted-foreground">
        {task.assignedTo?.fullName ?? "Sin asignar"}
      </span>
    ),
    endDate: <span className="text-sm text-muted-foreground">{formatCaseDate(task.endDate)}</span>,
    lastSeenAt: (
      <span className="text-sm text-muted-foreground">{formatCaseDateTime(task.lastSeenAt)}</span>
    ),
    name: <span className="font-medium text-foreground">{task.name}</span>,
    notes: (
      <span className="block max-w-[280px] truncate text-sm text-muted-foreground">
        {task.notes || "Sin observaciones"}
      </span>
    ),
    startDate: (
      <span className="text-sm text-muted-foreground">{formatCaseDate(task.startDate)}</span>
    ),
    status: (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getTaskStatusClassName(
          task.status
        )}`}
      >
        {caseTaskStatusLabels[task.status]}
      </span>
    )
  };

  return cellRenderMap[column];
}
