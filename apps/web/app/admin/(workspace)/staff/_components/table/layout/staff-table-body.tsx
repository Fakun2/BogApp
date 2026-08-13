import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { useStaffTableContext } from "../context/staff-table-context";
import { StaffDataTableCell } from "../cells/staff-table-columns";
import { TableState } from "../states/table-state";

export function StaffTableBody() {
  const { error, hasState, loading, pageRows, table, workers } = useStaffTableContext();
  const columnCount = table.getVisibleFlatColumns().length;

  return (
    <Table className="min-w-full text-xs">
      <TableBody className="[&_tr:last-child]:border-0">
        <TableState
          columnCount={columnCount}
          error={error}
          loading={loading}
          workers={workers}
        />
        {!hasState ? (
          <>
            {pageRows.map((row) => (
              <TableRow className="h-16 border-border/40 hover:bg-secondary/30" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <StaffDataTableCell columnId={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </StaffDataTableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : null}
      </TableBody>
    </Table>
  );
}
