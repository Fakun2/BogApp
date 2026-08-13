import { Columns3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
import { caseTasksTableColumnLabels } from "../../../_constants/cases.constants";
import type { CaseTasksTableColumn } from "../../../_types/cases.types";

export const allCaseTasksTableColumns = Object.keys(
  caseTasksTableColumnLabels
) as CaseTasksTableColumn[];

export function TaskColumnsMenu({
  onToggleColumn,
  visibleColumns
}: {
  onToggleColumn: (column: CaseTasksTableColumn, checked: boolean) => void;
  visibleColumns: CaseTasksTableColumn[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={Columns3} label="Columnas" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allCaseTasksTableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={visibleColumns.includes(column)}
            key={column}
            onCheckedChange={(value) => onToggleColumn(column, Boolean(value))}
          >
            {caseTasksTableColumnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
