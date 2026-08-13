import { dashboardHttpClient } from "@/lib/http";
import type {
  AddTenantCurrenciesInput,
  AvailableTenantCurrenciesQueryParams,
  AvailableTenantCurrenciesResponseDto,
  CreateCurrencyInput,
  CurrencyDto,
  CurrencyListResponseDto,
  CurrencyQueryParams,
  TenantCurrencyListResponseDto,
  TenantCurrencyQueryParams,
  UpdateCurrencyInput
} from "../_types/currencies.types";

export const currencyKeys = {
  all: ["currencies"] as const,
  available: (params: AvailableTenantCurrenciesQueryParams) =>
    [...currencyKeys.all, "available", params] as const,
  list: (params: CurrencyQueryParams) => [...currencyKeys.all, "list", params] as const,
  tenant: (params: TenantCurrencyQueryParams) => [...currencyKeys.all, "tenant", params] as const
};

export async function listCurrencies(
  params: CurrencyQueryParams
): Promise<CurrencyListResponseDto> {
  const [sortBy, sortDirection] = params.sort.split(":");

  return dashboardHttpClient.request<CurrencyListResponseDto>({
    params: {
      active: toActiveParam(params.status),
      limit: params.limit,
      offset: params.offset,
      search: params.search,
      sortBy,
      sortDirection
    },
    path: "/currencies"
  });
}

export async function listTenantCurrencies(
  params: TenantCurrencyQueryParams
): Promise<TenantCurrencyListResponseDto> {
  const [sortBy, sortDirection] = params.sort.split(":");

  return dashboardHttpClient.request<TenantCurrencyListResponseDto>({
    params: {
      active: toActiveParam(params.status),
      cursor: params.cursor ?? undefined,
      limit: params.limit,
      search: params.search,
      sortBy,
      sortDirection
    },
    path: "/currencies/tenant"
  });
}

export async function addTenantCurrencies(
  input: AddTenantCurrenciesInput
): Promise<{ items: CurrencyDto[] }> {
  return dashboardHttpClient.request<{ items: CurrencyDto[] }>({
    body: input,
    method: "POST",
    path: "/currencies/tenant"
  });
}

export async function disableTenantCurrency(currencyCode: string): Promise<CurrencyDto> {
  return dashboardHttpClient.request<CurrencyDto>({
    method: "DELETE",
    path: `/currencies/tenant/${currencyCode}`
  });
}

export async function listAvailableTenantCurrencies(
  params: AvailableTenantCurrenciesQueryParams
): Promise<AvailableTenantCurrenciesResponseDto> {
  return dashboardHttpClient.request<AvailableTenantCurrenciesResponseDto>({
    params,
    path: "/currencies/tenant/available"
  });
}

export async function createCurrency(input: CreateCurrencyInput): Promise<CurrencyDto> {
  return dashboardHttpClient.request<CurrencyDto>({
    body: input,
    method: "POST",
    path: "/currencies"
  });
}

export async function updateCurrency({
  currencyId,
  input
}: {
  currencyId: string;
  input: UpdateCurrencyInput;
}): Promise<CurrencyDto> {
  return dashboardHttpClient.request<CurrencyDto>({
    body: input,
    method: "PATCH",
    path: `/currencies/${currencyId}`
  });
}

export async function deleteCurrency(currencyId: string): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/currencies/${currencyId}`
  });
}

function toActiveParam(status: CurrencyQueryParams["status"]) {
  if (status === "active") {
    return true;
  }

  if (status === "inactive") {
    return false;
  }

  return undefined;
}
