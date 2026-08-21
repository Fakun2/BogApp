import type { CasePickerOption } from "../../cases/_components/case-picker-field";

export type CalendarCardProps = {
  canCreateExpense: boolean;
  canCreateHearing: boolean;
  canCreateTask: boolean;
  canUpdateExpense: boolean;
  caseId?: string;
  caseFiltersDisabled?: boolean;
  selectedCase?: CasePickerOption | null;
  onClearCaseFilter?: () => void;
  onSelectCaseFilter?: (caseItem: CasePickerOption) => void;
  scope?: "case" | "tenant";
};
