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
import type { StaffWorker } from "../../../_types/staff.types";

const columnLabels: Record<string, string> = {
  personal: "Personal",
  dni: "DNI",
  phone: "Celular",
  practiceAreas: "Areas de trabajo",
  role: "Rol",
  status: "Estado"
};

export function DataTableViewOptions({ table }: { table: Table<StaffWorker> }) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && columnLabels[column.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton icon={Columns3} label="Columnas" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={column.getIsVisible()}
            key={column.id}
            onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
          >
            {columnLabels[column.id]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
