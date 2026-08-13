import { useStaffTableContext } from "./context/staff-table-context";
import { StaffTableViewport } from "./layout/staff-table-viewport";
import { DataTablePagination } from "./pagination/data-table-pagination";

export function StaffTable() {
  const { pageIndex, pageInfo, workers, onNextPage, onPreviousPage } = useStaffTableContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-visible lg:overflow-hidden">
      <StaffTableViewport />
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
