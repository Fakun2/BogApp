import {
  flexRender,
  type Table as ReactTable
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { staffTablePageSize } from "../../_constants/staff.constants";
import type { StaffListResponse, StaffWorker } from "../../_types/staff.types";
import { DataTablePagination } from "./data-table-pagination";
import { FillerRow } from "./filler-row";
import { StaffDataTableCell } from "./staff-table-columns";
import { TableState } from "./table-state";

export function StaffTable({
  error,
  loading,
  pageIndex,
  pageInfo,
  table,
  workers,
  onNextPage,
  onPreviousPage
}: {
  error: Error | null;
  loading: boolean;
  pageIndex: number;
  pageInfo: StaffListResponse["pageInfo"] | undefined;
  table: ReactTable<StaffWorker>;
  workers: StaffWorker[];
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
}) {
  const pageRows = table.getRowModel().rows;
  const fillerRows = Math.max(0, staffTablePageSize - pageRows.length);
  const hasState =
    (loading && workers.length === 0) ||
    Boolean(error) ||
    (!loading && workers.length === 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-auto rounded-2xl">
        <Table className="h-full text-xs">
          <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="h-11 px-4 text-sm font-medium text-foreground"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-0">
            <TableState
              error={error}
              loading={loading}
              workers={workers}
            />
            {!hasState ? (
              <>
                {pageRows.map((row) => (
                  <TableRow className="h-[70px] border-border/40 hover:bg-secondary/30" key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <StaffDataTableCell columnId={cell.column.id} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </StaffDataTableCell>
                    ))}
                  </TableRow>
                ))}
                {Array.from({ length: fillerRows }).map((_, index) => (
                  <FillerRow key={`staff-filler-${index}`} />
                ))}
              </>
            ) : null}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        hasNextPage={pageInfo?.hasNextPage ?? false}
        nextCursor={pageInfo?.nextCursor ?? null}
        pageIndex={pageIndex}
        pageRowsLength={workers.length}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </div>
  );
}
