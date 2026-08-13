import type { ReactNode } from "react";
import type { CaseTaskFormValues } from "@/lib/validation/cases";
import type { CaseTaskDto, TaskAssigneeOption } from "../../../_types/cases.types";

export type CaseTaskSheetProps = {
  assignees?: TaskAssigneeOption[];
  caseId: string;
  defaultDate?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  task?: CaseTaskDto;
  trigger?: ReactNode;
};

export type CaseTaskFieldErrors = Partial<Record<keyof CaseTaskFormValues, string>>;
