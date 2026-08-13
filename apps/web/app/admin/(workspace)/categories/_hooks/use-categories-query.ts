"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import {
  categoryKeys,
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../_api/categories.api";
import type {
  CategoryQueryParams,
  CreateCategoryInput,
  UpdateCategoryInput
} from "../_types/categories.types";

export function useCategoriesQuery(params: CategoryQueryParams) {
  return useDashboardQuery({
    permission: "categories:read",
    queryKey: categoryKeys.list(params),
    queryFn: () => listCategories(params)
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "categories:create",
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => invalidateCategoryQueries(queryClient)
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "categories:update",
    mutationFn: (variables: { categoryId: string; input: UpdateCategoryInput }) =>
      updateCategory(variables),
    onSuccess: () => invalidateCategoryQueries(queryClient)
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useDashboardMutation({
    permission: "categories:delete",
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => invalidateCategoryQueries(queryClient)
  });
}

function invalidateCategoryQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    predicate: (query) => query.queryKey.includes(categoryKeys.all[0])
  });
}
