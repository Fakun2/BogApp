export type LegalCatalogItem = {
  active: boolean;
  createdAt?: string;
  description?: string | null;
  id: string;
  name: string;
  updatedAt?: string;
};

export type Province = LegalCatalogItem & {
  code: string;
  country: string;
  displayOrder: number;
  province: string | null;
};

export type Forum = LegalCatalogItem & {
  custom: boolean;
  isSystem: boolean;
  province: Pick<Province, "code" | "country" | "id" | "name" | "province"> | null;
  provinceId: string | null;
  templateId: string;
};

export type LegalCatalogTab = "forums" | "provinces";

export type LegalCatalogSort = "name:asc" | "name:desc";

export type LegalCatalogPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  offset: number;
  total: number;
};

export type LegalCatalogPage<TItem> = {
  items: TItem[];
  pageInfo: LegalCatalogPageInfo;
};

export type ForumQueryParams = {
  limit: number;
  offset: number;
  provinceId?: string;
  sort: LegalCatalogSort;
};

export type ProvinceQueryParams = {
  limit: number;
  offset: number;
  sort: LegalCatalogSort;
};
