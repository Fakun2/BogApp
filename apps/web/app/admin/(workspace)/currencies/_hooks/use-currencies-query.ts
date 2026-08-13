"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import {
  addTenantCurrencies,
  currencyKeys,
  disableTenantCurrency,
  listAvailableTenantCurrencies,
  listCurrencies,
  listTenantCurrencies
} from "../_api/currencies.api";
import type {
  AddTenantCurrenciesInput,
  AvailableTenantCurrenciesQueryParams,
  CurrencyQueryParams,
  TenantCurrencyQueryParams
} from "../_types/currencies.types";

export function useCurrenciesQuery(params: CurrencyQueryParams) {
  return useDashboardQuery({
    permission: "currencies:read",
    queryKey: currencyKeys.list(params),
    queryFn: () => listCurrencies(params)
  });
}

export function useTenantCurrenciesQuery(params: TenantCurrencyQueryParams) {
  return useDashboardQuery({
    permission: "currencies:read",
    queryKey: currencyKeys.tenant(params),
    queryFn: () => listTenantCurrencies(params)
  });
}

export function useAvailableTenantCurrenciesQuery(params: AvailableTenantCurrenciesQueryParams) {
  return useDashboardQuery({
    permission: "currencies:read",
    queryKey: currencyKeys.available(params),
    queryFn: () => listAvailableTenantCurrencies(params)
  });
}

export function useAddTenantCurrenciesMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:update",
    mutationFn: (input: AddTenantCurrenciesInput) => addTenantCurrencies(input),
    onSuccess: () => invalidateCurrencyQueries(queryClient)
  });
}

export function useDisableTenantCurrencyMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "finance:update",
    mutationFn: (currencyCode: string) => disableTenantCurrency(currencyCode),
    onSuccess: () => invalidateCurrencyQueries(queryClient)
  });
}

function invalidateCurrencyQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    predicate: (query) => query.queryKey.includes(currencyKeys.all[0])
  });
}
