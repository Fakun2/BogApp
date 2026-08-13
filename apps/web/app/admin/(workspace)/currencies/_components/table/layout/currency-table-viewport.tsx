import { CurrencyTableBody } from "./currency-table-body";
import { CurrencyTableHeader } from "./currency-table-header";
import { useCurrencyTableContext } from "../context/currency-table-context";

export function CurrencyTableViewport() {
  const { hasState } = useCurrencyTableContext();

  return (
    <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden rounded-md border border-border/30">
      <div className="flex h-full min-h-0 min-w-[640px] flex-col">
        <CurrencyTableHeader />
        <div
          className={`min-h-0 flex-1 overscroll-contain [scrollbar-gutter:stable] ${hasState ? "overflow-y-hidden" : "overflow-y-auto"}`}
        >
          <CurrencyTableBody />
        </div>
      </div>
    </div>
  );
}
