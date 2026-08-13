export type FinanceCategoryKind = "income" | "expense" | "both";
export type FinanceCategoryOrigin = "global" | "tenant";
export type CategoryStatusFilter = "all" | "active" | "inactive";
export type CategoryKindFilter = "all" | FinanceCategoryKind;
export type CategoryOriginFilter = "all" | FinanceCategoryOrigin;
export type CategorySortDirection = "asc" | "desc";
export type CategorySortKey = "active" | "kind" | "name" | "origin";
export type CategoryTableColumn = "active" | "kind" | "name" | "origin";

export type CategoryDto = {
  active: boolean;
  code?: string;
  createdAt: string;
  id: string;
  kind: FinanceCategoryKind;
  name: string;
  origin: FinanceCategoryOrigin;
  updatedAt: string;
};

export type CategoryMetricsDto = {
  active: number;
  global: number;
  tenant: number;
};

export type CategoryPageInfoDto = {
  hasNextPage: boolean;
  limit: number;
  nextCursor: string | null;
};

export type CategoryListResponseDto = {
  items: CategoryDto[];
  metrics: CategoryMetricsDto;
  pageInfo: CategoryPageInfoDto;
};

export type CategoryQueryParams = {
  cursor?: string | null;
  kind: CategoryKindFilter;
  limit: number;
  origin: CategoryOriginFilter;
  search?: string;
  sort: `${CategorySortKey}:${CategorySortDirection}`;
  status: CategoryStatusFilter;
};

export type CategoryFiltersState = {
  kind: CategoryKindFilter;
  origin: CategoryOriginFilter;
  search: string;
  status: CategoryStatusFilter;
};

export type CreateCategoryInput = {
  active?: boolean;
  kind: FinanceCategoryKind;
  name: string;
};

export type UpdateCategoryInput = {
  active?: boolean;
  kind: FinanceCategoryKind;
  name: string;
};
