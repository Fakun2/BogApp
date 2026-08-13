import type { CategoryDto, FinanceCategoryKind } from "../../categories/_types/categories.types";

export function filterCategoriesForMovement(categories: CategoryDto[], mode: FinanceCategoryKind) {
  return categories.filter(
    (category) => !isUncategorizedGlobalCategory(category) && (category.kind === mode || category.kind === "both")
  );
}

function isUncategorizedGlobalCategory(category: CategoryDto) {
  return (
    category.origin === "global" &&
    (category.code === "sin-categoria" || normalizeCategoryName(category.name) === "sin categoria")
  );
}

function normalizeCategoryName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
