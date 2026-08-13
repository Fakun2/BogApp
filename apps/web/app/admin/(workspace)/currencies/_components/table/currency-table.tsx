import { useCurrencyTableContext } from "./context/currency-table-context";
import { CurrencyTableViewport } from "./layout/currency-table-viewport";
import { CurrencyTablePagination } from "./pagination/currency-table-pagination";

export function CurrencyTable() {
  const { currencies, pageIndex, pageInfo, onNextPage, onPreviousPage } =
    useCurrencyTableContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-visible lg:overflow-hidden">
      <CurrencyTableViewport />
      <CurrencyTablePagination
        hasNextPage={pageInfo?.hasNextPage ?? false}
        nextCursor={pageInfo?.nextCursor ?? null}
        pageIndex={pageIndex}
        pageRowsLength={currencies.length}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </div>
  );
}
