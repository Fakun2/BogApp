import { useCategoryTableContext } from "./context/category-table-context";
import { CategoryTableViewport } from "./layout/category-table-viewport";
import { CategoryTablePagination } from "./pagination/category-table-pagination";

export function CategoryTable() {
  const { categories, pageIndex, pageInfo, onNextPage, onPreviousPage } =
    useCategoryTableContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CategoryTableViewport />
      <CategoryTablePagination
        hasNextPage={pageInfo?.hasNextPage ?? false}
        nextCursor={pageInfo?.nextCursor ?? null}
        pageIndex={pageIndex}
        pageRowsLength={categories.length}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </div>
  );
}
