import type { CategoryDto } from "../../../_types/categories.types";
import { AdminTableRowsSkeleton } from "../../../../_components/admin-skeletons";
import { StateRow } from "./state-row";

export function CategoryTableState({
  categories,
  columnCount,
  error,
  loading
}: {
  categories: CategoryDto[];
  columnCount: number;
  error: Error | null;
  loading: boolean;
}) {
  if (loading && categories.length === 0) {
    return <AdminTableRowsSkeleton columnCount={columnCount} rowCount={8} />;
  }

  if (error) {
    return <StateRow columnCount={columnCount} message={error.message} tone="error" />;
  }

  if (categories.length === 0) {
    return <StateRow columnCount={columnCount} message="Todavia no hay categorias para mostrar." />;
  }

  return null;
}
