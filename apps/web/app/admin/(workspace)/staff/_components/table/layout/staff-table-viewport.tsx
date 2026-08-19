import { StaffTableBody } from "./staff-table-body";
import { StaffTableHeader } from "./staff-table-header";

export function StaffTableViewport() {
  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-none rounded-2xl">
      <div className="flex h-full min-h-0 min-w-[900px] flex-col">
        <StaffTableHeader />
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none overscroll-contain [scrollbar-gutter:stable]">
          <StaffTableBody />
        </div>
      </div>
    </div>
  );
}
