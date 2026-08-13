import { caseInstanceLabels } from "../_constants/cases.constants";
import type { CaseFiltersDraft } from "../_types/case-filter.types";
import type { CaseInstance, CaseStatus } from "../_types/cases.types";

export const emptyCaseFilters: Readonly<CaseFiltersDraft> = {
  court: "",
  filingDate: "",
  forumTemplateId: "",
  instance: "",
  judicialCenter: "",
  provinceId: "",
  search: "",
  status: ""
};

export const caseStatusFilterOptions: Array<{ label: string; value: "" | CaseStatus }> = [
  { label: "Todos", value: "" },
  { label: "Abiertos", value: "open" },
  { label: "Pausados", value: "paused" },
  { label: "Cerrados", value: "closed" }
];

export const caseInstanceFilterOptions: Array<{ label: string; value: "" | CaseInstance }> = [
  { label: "Todas", value: "" },
  { label: caseInstanceLabels.first, value: "first" },
  { label: caseInstanceLabels.second, value: "second" },
  { label: caseInstanceLabels.third, value: "third" }
];

export function hasCaseFilters(filters: CaseFiltersDraft) {
  return Object.values(filters).some(Boolean);
}

export function hasCaseFilterChanges({
  draft,
  filters
}: {
  draft: CaseFiltersDraft;
  filters: CaseFiltersDraft;
}) {
  return Object.entries(draft).some(
    ([key, value]) => filters[key as keyof CaseFiltersDraft] !== value
  );
}

export function toCaseFilterQueryUpdates(filters: CaseFiltersDraft) {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value || null])
  ) as Record<keyof CaseFiltersDraft, string | null>;
}
