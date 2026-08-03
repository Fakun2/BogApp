import type { ReactNode } from "react";
import type { CaseExpenseFormValues } from "@/lib/validation/cases";
import type { CaseExpenseDto, CaseTaskDto } from "../../../_types/cases.types";

export type CaseExpenseSheetProps = {
  caseId: string;
  defaultDate?: string;
  defaultTaskId?: string;
  expense?: CaseExpenseDto;
  hideTaskSelect?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  tasks: CaseTaskDto[];
  trigger?: ReactNode;
};

export type CaseExpenseFieldErrors = Partial<Record<keyof CaseExpenseFormValues, string>>;
