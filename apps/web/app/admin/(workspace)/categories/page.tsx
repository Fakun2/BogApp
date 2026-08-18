"use client";

import { Tags } from "lucide-react";
import { UnauthorizedState } from "@/components/ui/not-found";
import { AdminMetricsGrid } from "../_components/admin-metrics-grid";
import { AdminMetricsSkeletonGrid } from "../_components/admin-skeletons";
import { RequirePermission } from "../_components/auth";
import { CategoryTableCard } from "./_components/table/category-table-card";
import { categoryTablePageSize } from "./_constants/category.constants";
import { useCategoriesPageState } from "./_hooks/use-categories-page-state";
import { useCategoriesQuery } from "./_hooks/use-categories-query";
import { toCategorySort } from "./_utils/category-sort";

export default function CategoriesPage() {
  const pageState = useCategoriesPageState();
  const categoriesQuery = useCategoriesQuery({
    cursor: pageState.cursor,
    kind: pageState.filters.kind,
    limit: categoryTablePageSize,
    origin: pageState.filters.origin,
    search: pageState.filters.search,
    sort: toCategorySort(pageState.sortKey, pageState.sortDirection),
    status: pageState.filters.status
  });
  const metrics = categoriesQuery.data?.metrics;

  return (
    <RequirePermission permissions={["categories:read"]} fallback={<RestrictedCategories />}>
      <div className="flex h-[calc(100svh-104px)] min-h-0 flex-col gap-2 overflow-hidden md:h-[calc(100svh-112px)] md:gap-3">
        {categoriesQuery.isLoading && !categoriesQuery.data ? (
          <AdminMetricsSkeletonGrid count={3} />
        ) : (
          <AdminMetricsGrid
            metrics={[
              { icon: Tags, label: "Globales", value: metrics?.global ?? 0 },
              { icon: Tags, label: "Del estudio", value: metrics?.tenant ?? 0 },
              { icon: Tags, label: "Activas", value: metrics?.active ?? 0 }
            ]}
          />
        )}

        <CategoryTableCard
          categories={categoriesQuery.data?.items ?? []}
          error={categoriesQuery.error}
          loading={categoriesQuery.isLoading}
          pageIndex={pageState.pageIndex}
          pageInfo={categoriesQuery.data?.pageInfo}
          filters={pageState.filters}
          sortDirection={pageState.sortDirection}
          sortKey={pageState.sortKey}
          onApplyFilters={pageState.applyFilters}
          onClearFilters={pageState.clearFilters}
          onCreateSuccess={pageState.resetPagination}
          onNextPage={pageState.nextPage}
          onPreviousPage={pageState.previousPage}
          onSort={pageState.sortBy}
        />
      </div>
    </RequirePermission>
  );
}

function RestrictedCategories() {
  return (
    <UnauthorizedState
      title="Categorias restringidas"
      description="Necesitas permisos adicionales para acceder a las categorias financieras."
    />
  );
}
