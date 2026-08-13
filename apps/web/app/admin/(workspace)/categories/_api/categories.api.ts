import { dashboardHttpClient } from "@/lib/http";
import type {
  CategoryDto,
  CategoryListResponseDto,
  CategoryQueryParams,
  CreateCategoryInput,
  UpdateCategoryInput
} from "../_types/categories.types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params: CategoryQueryParams) => [...categoryKeys.all, "list", params] as const
};

export async function listCategories(
  params: CategoryQueryParams
): Promise<CategoryListResponseDto> {
  const [sortBy, sortDirection] = params.sort.split(":");

  return dashboardHttpClient.request<CategoryListResponseDto>({
    params: {
      active: toActiveParam(params.status),
      cursor: params.cursor ?? undefined,
      kind: params.kind === "all" ? undefined : params.kind,
      limit: params.limit,
      origin: params.origin === "all" ? undefined : params.origin,
      search: params.search,
      sortBy,
      sortDirection
    },
    path: "/categories"
  });
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryDto> {
  return dashboardHttpClient.request<CategoryDto>({
    body: input,
    method: "POST",
    path: "/categories"
  });
}

export async function updateCategory({
  categoryId,
  input
}: {
  categoryId: string;
  input: UpdateCategoryInput;
}): Promise<CategoryDto> {
  return dashboardHttpClient.request<CategoryDto>({
    body: input,
    method: "PATCH",
    path: `/categories/${categoryId}`
  });
}

export async function deleteCategory(categoryId: string): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/categories/${categoryId}`
  });
}

function toActiveParam(status: CategoryQueryParams["status"]) {
  if (status === "active") {
    return true;
  }

  if (status === "inactive") {
    return false;
  }

  return undefined;
}
