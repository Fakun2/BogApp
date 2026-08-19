import { useCategoryTableContext } from "../context/category-table-context";
import { CategoryTableBody } from "./category-table-body";
import { CategoryTableHeader } from "./category-table-header";

export function CategoryTableViewport() {
  const { hasState } = useCategoryTableContext();

  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-none rounded-md border border-border/30">
      <div className="flex h-full min-h-0 min-w-[680px] flex-col">
        <CategoryTableHeader />
        <div
          className={`min-h-0 flex-1 scrollbar-none overscroll-contain [scrollbar-gutter:stable] ${
            hasState ? "overflow-y-hidden" : "overflow-y-auto"
          }`}
        >
          <CategoryTableBody />
        </div>
      </div>
    </div>
  );
}
