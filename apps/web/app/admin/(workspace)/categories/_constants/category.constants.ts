import type {
  CategoryTableColumn,
  FinanceCategoryKind,
  FinanceCategoryOrigin
} from "../_types/categories.types";

export const categoryTablePageSize = 12;

export const categoryKindLabels: Record<FinanceCategoryKind, string> = {
  both: "Ambos",
  expense: "Egreso",
  income: "Ingreso"
};

export const categoryOriginLabels: Record<FinanceCategoryOrigin, string> = {
  global: "Global",
  tenant: "Del estudio"
};

export const categoryTableColumnLabels: Record<CategoryTableColumn, string> = {
  active: "Estado",
  kind: "Tipo",
  name: "Nombre",
  origin: "Origen"
};

export const categoryTableDefaultColumns: CategoryTableColumn[] = [
  "name",
  "kind",
  "origin",
  "active"
];

export const categoryTableHeaderClassNameByColumn: Record<string, string> = {
  actions: "w-28 text-right",
  active: "w-32",
  kind: "w-36",
  name: "min-w-[240px]",
  origin: "w-36"
};

export const categoryTableCellClassNameByColumn: Record<string, string> = {
  actions: "h-12 px-3 py-2 text-right",
  active: "h-12 px-3 py-2",
  kind: "h-12 px-3 py-2",
  name: "h-12 px-3 py-2",
  origin: "h-12 px-3 py-2"
};
