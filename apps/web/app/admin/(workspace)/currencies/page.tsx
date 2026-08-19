"use client";

import { BadgeDollarSign, CircleDollarSign } from "lucide-react";
import { UnauthorizedState } from "@/components/ui/not-found";
import { AdminMetricsGrid } from "../_components/admin-metrics-grid";
import { AdminMetricsSkeletonGrid } from "../_components/admin-skeletons";
import { RequirePermission } from "../_components/auth";
import { currencyTablePageSize } from "./_constants/currency.constants";
import { CurrencyTableCard } from "./_components/table/currency-table-card";
import { useCurrenciesPageState } from "./_hooks/use-currencies-page-state";
import { useTenantCurrenciesQuery } from "./_hooks/use-currencies-query";
import { toTenantCurrencySort } from "./_utils/currency-sort";

export default function CurrenciesPage() {
  const pageState = useCurrenciesPageState();
  const currenciesQuery = useTenantCurrenciesQuery({
    cursor: pageState.cursor,
    limit: currencyTablePageSize,
    search: pageState.search,
    sort: toTenantCurrencySort(pageState.sortKey, pageState.sortDirection),
    status: pageState.status
  });
  const metrics = currenciesQuery.data?.metrics;

  return (
    <RequirePermission permissions={["currencies:read"]} fallback={<RestrictedCurrencies />}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden md:gap-3">
        {currenciesQuery.isLoading && !currenciesQuery.data ? (
          <AdminMetricsSkeletonGrid count={2} />
        ) : (
          <AdminMetricsGrid
            metrics={[
              {
                icon: CircleDollarSign,
                label: "Monedas disponibles",
                value: metrics?.available ?? 0
              },
              {
                icon: BadgeDollarSign,
                label: "Monedas activas",
                value: metrics?.active ?? 0
              }
            ]}
          />
        )}

        <CurrencyTableCard
          currencies={currenciesQuery.data?.items ?? []}
          error={currenciesQuery.error}
          loading={currenciesQuery.isLoading}
          pageIndex={pageState.pageIndex}
          pageInfo={currenciesQuery.data?.pageInfo}
          search={pageState.search}
          sortDirection={pageState.sortDirection}
          sortKey={pageState.sortKey}
          status={pageState.status}
          onAddSuccess={pageState.resetPagination}
          onNextPage={pageState.nextPage}
          onPreviousPage={pageState.previousPage}
          onSearchChange={pageState.updateSearch}
          onSort={pageState.sortBy}
          onStatusChange={pageState.updateStatus}
        />
      </div>
    </RequirePermission>
  );
}

function RestrictedCurrencies() {
  return (
    <UnauthorizedState
      title="Monedas restringidas"
      description="Necesitas permisos adicionales para acceder al catalogo de monedas."
    />
  );
}
