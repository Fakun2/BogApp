import type { CategoryDto } from "../../../_types/categories.types";
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
    return <StateRow columnCount={columnCount} fill message="Cargando categorias..." />;
  }

  if (error) {
    return <StateRow columnCount={columnCount} message={error.message} tone="error" />;
  }

  if (categories.length === 0) {
    return <StateRow columnCount={columnCount} message="Todavia no hay categorias para mostrar." />;
  }

  return null;
}
