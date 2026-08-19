"use client";

import { RequirePermission } from "../_components/auth";
import { useTenantCurrenciesQuery } from "../currencies/_hooks/use-currencies-query";
import { CashboxSummaryGrid } from "./_components/cashbox-summary-grid";
import { CashboxTableCard } from "./_components/cashbox-table-card";
import { RestrictedCashbox } from "./_components/restricted-cashbox";
import { cashboxMovementsPageSize } from "./_constants/cashbox.constants";
import {
  useCashboxMovementsQuery,
  useCashboxSummaryQuery
} from "./_hooks/use-cashbox-query";
import { useCashboxPageState } from "./_hooks/use-cashbox-page-state";

export default function CashboxPage() {
  const pageState = useCashboxPageState();
  const currenciesQuery = useTenantCurrenciesQuery({
    cursor: null,
    limit: 50,
    search: "",
    sort: "name:asc",
    status: "active"
  });
  const summaryQuery = useCashboxSummaryQuery({
    currencyCode: pageState.currencyCode,
    date: pageState.date
  });
  const selectedCurrencyCode = pageState.currencyCode ?? summaryQuery.data?.currency.code;
  const movementsQuery = useCashboxMovementsQuery({
    currencyCode: selectedCurrencyCode,
    cursor: pageState.cursor,
    date: pageState.date,
    limit: cashboxMovementsPageSize
  });
  const currencies = currenciesQuery.data?.items ?? [];
  const summary = summaryQuery.data;

  return (
    <RequirePermission permissions={["finance:read"]} fallback={<RestrictedCashbox />}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-none md:gap-3">
        <CashboxSummaryGrid
          currencies={currencies}
          currencyCode={selectedCurrencyCode}
          loading={summaryQuery.isLoading}
          summary={summary}
          onCurrencyChange={pageState.updateCurrencyCode}
        />

        <CashboxTableCard
          currencies={currencies}
          currencyCode={selectedCurrencyCode}
          date={pageState.date}
          error={movementsQuery.error}
          loading={movementsQuery.isLoading || summaryQuery.isLoading}
          movements={movementsQuery.data?.items ?? []}
          pageIndex={pageState.pageIndex}
          pageInfo={movementsQuery.data?.pageInfo}
          selectedBalance={summary?.balance ?? "0.00"}
          selectedBalanceSymbol={summary?.currency.symbol}
          onDateChange={pageState.updateDate}
          onMutationSuccess={pageState.resetPagination}
          onNextPage={pageState.nextPage}
          onPreviousPage={pageState.previousPage}
        />
      </div>
    </RequirePermission>
  );
}
