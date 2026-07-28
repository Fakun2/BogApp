import {
  defaultCaseSortDirection,
  defaultCaseSortKey
} from "../_constants/cases.constants";
import type { CaseSortDirection, CaseSortKey } from "../_types/cases.types";

const caseSortKeys: CaseSortKey[] = ["caseNumber", "caption", "createdAt", "status"];
const caseSortDirections: CaseSortDirection[] = ["asc", "desc"];

export function parseCaseSortKey(value?: string): CaseSortKey {
  return caseSortKeys.includes(value as CaseSortKey)
    ? (value as CaseSortKey)
    : defaultCaseSortKey;
}

export function parseCaseSortDirection(value?: string): CaseSortDirection {
  return caseSortDirections.includes(value as CaseSortDirection)
    ? (value as CaseSortDirection)
    : defaultCaseSortDirection;
}

export function getNextCaseSortDirection({
  active,
  currentDirection
}: {
  active: boolean;
  currentDirection: CaseSortDirection;
}) {
  return active && currentDirection === "asc" ? "desc" : "asc";
}
