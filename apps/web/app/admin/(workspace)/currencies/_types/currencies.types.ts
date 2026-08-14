export type CurrencyDto = {
  active: boolean;
  code: string;
  cashboxBalance?: string;
  id: string;
  name: string;
  symbol: string;
};

export type CurrencyMetricsDto = {
  active: number;
  inactive: number;
  total: number;
};

export type TenantCurrencyMetricsDto = {
  active: number;
  available: number;
};

export type CurrencyPageInfoDto = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  offset: number;
  total: number;
};

export type TenantCurrencyPageInfoDto = {
  hasNextPage: boolean;
  limit: number;
  nextCursor: string | null;
};

export type CurrencyListResponseDto = {
  items: CurrencyDto[];
  metrics: CurrencyMetricsDto;
  pageInfo: CurrencyPageInfoDto;
};

export type TenantCurrencyListResponseDto = {
  items: CurrencyDto[];
  metrics: TenantCurrencyMetricsDto;
  pageInfo: TenantCurrencyPageInfoDto;
};

export type CurrencySort = "name:asc" | "name:desc" | "code:asc" | "code:desc";
export type TenantCurrencySort =
  | "name:asc"
  | "name:desc"
  | "code:asc"
  | "code:desc"
  | "active:asc"
  | "active:desc";
export type CurrencyStatusFilter = "all" | "active" | "inactive";
export type CurrencySortDirection = "asc" | "desc";
export type CurrencySortKey = "active" | "code" | "name";
export type CurrencyTableColumn = "active" | "code" | "name" | "symbol";

export type CurrencyQueryParams = {
  limit: number;
  offset: number;
  search?: string;
  sort: CurrencySort;
  status: CurrencyStatusFilter;
};

export type TenantCurrencyQueryParams = {
  cursor?: string | null;
  limit: number;
  search?: string;
  sort: TenantCurrencySort;
  status: CurrencyStatusFilter;
};

export type AddTenantCurrenciesInput = {
  currencyCodes: string[];
};

export type AvailableTenantCurrenciesResponseDto = {
  items: CurrencyDto[];
};

export type AvailableTenantCurrenciesQueryParams = {
  limit: number;
  search?: string;
};

export type CreateCurrencyInput = {
  code: string;
  name: string;
  symbol: string;
};

export type UpdateCurrencyInput = {
  active?: boolean;
  name: string;
  symbol: string;
};
