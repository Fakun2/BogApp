import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell } from "@/components/ui/table";
import type {
  StaffListResponse,
  StaffSortDirection,
  StaffSortKey,
  StaffWorker
} from "../../../_types/staff.types";
import { staffTableCellClassNameByColumn } from "../../../_constants/staff.constants";
import { getInitials } from "../../../_utils/staff-format";
import { PracticeAreaList } from "./practice-area-list";
import { SortableColumnHeader } from "./sortable-column-header";
import { StaffRowActions } from "../actions/staff-row-actions";
import { StatusBadge } from "./status-badge";

export function getStaffTableColumns({
  onStaffUpdated,
  sortDirection,
  sortKey,
  staffData,
  onSort
}: {
  onStaffUpdated: () => void;
  sortDirection: StaffSortDirection;
  sortKey: StaffSortKey;
  staffData: StaffListResponse | undefined;
  onSort: (key: StaffSortKey) => void;
}): Array<ColumnDef<StaffWorker>> {
  return [
    {
      id: "select",
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          aria-label="Seleccionar todas las filas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label={`Seleccionar ${row.original.fullName}`}
        />
      )
    },
    {
      id: "personal",
      accessorFn: (worker) => `${worker.fullName} ${worker.email}`,
      filterFn: "includesString",
      header: () => (
        <SortableColumnHeader
          active={sortKey === "firstName" || sortKey === "lastName"}
          direction={sortDirection}
          label="Personal"
          onClick={() => onSort(sortKey === "firstName" ? "lastName" : "firstName")}
        />
      ),
      cell: ({ row }) => {
        const worker = row.original;

        return (
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[11px] font-semibold text-secondary-foreground">
              {getInitials(worker.fullName)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {worker.fullName}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {worker.email}
              </span>
            </span>
          </div>
        );
      }
    },
    {
      id: "dni",
      accessorFn: (worker) => worker.dni ?? "",
      filterFn: "includesString",
      header: "DNI",
      cell: ({ row }) => <NullableText value={row.original.dni} />
    },
    {
      id: "phone",
      accessorFn: (worker) => worker.phone ?? "",
      filterFn: "includesString",
      header: "Celular",
      cell: ({ row }) => <NullableText value={row.original.phone} />
    },
    {
      id: "practiceAreas",
      accessorFn: (worker) => worker.practiceAreas.map((area) => area.name).join(" "),
      filterFn: "includesString",
      header: "Areas de trabajo",
      cell: ({ row }) => <PracticeAreaList worker={row.original} />
    },
    {
      id: "role",
      accessorFn: (worker) => worker.role?.name ?? "Sin rol",
      filterFn: "equalsString",
      header: () => (
        <SortableColumnHeader
          active={sortKey === "role"}
          direction={sortDirection}
          label="Rol"
          onClick={() => onSort("role")}
        />
      ),
      cell: ({ row }) => <NullableText value={row.original.role?.name ?? null} />
    },
    {
      id: "status",
      accessorKey: "status",
      filterFn: "equalsString",
      header: () => (
        <SortableColumnHeader
          active={sortKey === "status"}
          direction={sortDirection}
          label="Estado"
          onClick={() => onSort("status")}
        />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      header: "Acciones",
      cell: ({ row }) => (
        <StaffRowActions staffData={staffData} worker={row.original} onUpdated={onStaffUpdated} />
      )
    }
  ];
}

export function StaffDataTableCell({
  children,
  columnId
}: {
  children: ReactNode;
  columnId: string;
}) {
  return (
    <TableCell className={staffTableCellClassNameByColumn[columnId] ?? "h-16 px-3 py-2"}>
      {children}
    </TableCell>
  );
}

function NullableText({ value }: { value: string | null }) {
  return (
    <span className={value ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
      {value || "Sin cargar"}
    </span>
  );
}
