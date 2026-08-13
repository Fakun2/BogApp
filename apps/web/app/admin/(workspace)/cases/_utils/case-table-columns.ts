import {
  casesTableColumnLabels,
  defaultCasesTableColumns
} from "../_constants/cases.constants";
import type { CasesTableColumn } from "../_types/cases.types";

const allCasesTableColumns = Object.keys(casesTableColumnLabels) as CasesTableColumn[];

export function parseCasesTableColumns(value?: string): CasesTableColumn[] {
  const selected = (value ?? "")
    .split(",")
    .filter((column): column is CasesTableColumn =>
      allCasesTableColumns.includes(column as CasesTableColumn)
    );

  return selected.length ? selected : [...defaultCasesTableColumns];
}

export function serializeCasesTableColumns(columns: CasesTableColumn[]) {
  return columns.join(",");
}

export function isCasesTableColumnVisible(columns: CasesTableColumn[], column: CasesTableColumn) {
  return columns.includes(column);
}

export function getCasesTableColumnCount(columns: CasesTableColumn[], hasActions: boolean) {
  return columns.length + (hasActions ? 1 : 0);
}

export { allCasesTableColumns };
