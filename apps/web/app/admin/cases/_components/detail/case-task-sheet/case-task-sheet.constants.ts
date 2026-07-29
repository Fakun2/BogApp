import type { CaseTaskFormValues } from "@/lib/validation/cases";
import { caseTaskStatusLabels } from "../../../_constants/cases.constants";
import { mapRecordToOptions } from "../../../_utils/case-options";

export const caseTaskStatusOptions = mapRecordToOptions(caseTaskStatusLabels);

export const emptyCaseTaskDraft: CaseTaskFormValues = {
  endDate: "",
  name: "",
  notes: "",
  startDate: "",
  status: "pending"
};
