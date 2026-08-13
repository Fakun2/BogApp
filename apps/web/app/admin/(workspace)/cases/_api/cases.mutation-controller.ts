import type {
  CaseExpenseFormValues,
  CaseHearingFormValues,
  CaseFormValues,
  CaseTaskFormValues
} from "@/lib/validation/cases";
import type {
  CaseDto,
  CaseExpenseAttachmentDto,
  CaseExpenseDto,
  CaseHearingDto,
  CaseTaskDto
} from "../_types/cases.types";
import {
  deleteCase,
  deleteCaseExpense,
  deleteCaseExpenseAttachment,
  deleteCaseHearing,
  deleteCaseTask,
  markCaseTaskSeen,
  saveCase,
  saveCaseExpense,
  saveCaseHearing,
  saveCaseTask,
  uploadCaseExpenseAttachment
} from "./cases.api";

export type CasesMutationSpec<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  permission: string;
};

export const casesMutations = {
  saveCase(caseId?: string): CasesMutationSpec<CaseDto, CaseFormValues> {
    return {
      mutationFn: (input) => saveCase({ caseId, input }),
      permission: caseId ? "cases:update" : "cases:create"
    };
  },

  deleteCase(): CasesMutationSpec<{ status: "ok" }, string> {
    return {
      mutationFn: deleteCase,
      permission: "cases:delete"
    };
  },

  saveTask({
    caseId,
    taskId
  }: {
    caseId: string;
    taskId?: string;
  }): CasesMutationSpec<CaseTaskDto, CaseTaskFormValues> {
    return {
      mutationFn: (input) => saveCaseTask({ caseId, input, taskId }),
      permission: taskId ? "tasks:update" : "tasks:create"
    };
  },

  deleteTask(caseId: string): CasesMutationSpec<{ status: "ok" }, string> {
    return {
      mutationFn: (taskId) => deleteCaseTask({ caseId, taskId }),
      permission: "tasks:delete"
    };
  },

  markTaskSeen(caseId: string): CasesMutationSpec<CaseTaskDto, string> {
    return {
      mutationFn: (taskId) => markCaseTaskSeen({ caseId, taskId }),
      permission: "tasks:read"
    };
  },

  saveExpense({
    caseId,
    expenseId
  }: {
    caseId: string;
    expenseId?: string;
  }): CasesMutationSpec<CaseExpenseDto, CaseExpenseFormValues> {
    return {
      mutationFn: (input) => saveCaseExpense({ caseId, expenseId, input }),
      permission: expenseId ? "expenses:update" : "expenses:create"
    };
  },

  deleteExpense(caseId: string): CasesMutationSpec<{ status: "ok" }, string> {
    return {
      mutationFn: (expenseId) => deleteCaseExpense({ caseId, expenseId }),
      permission: "expenses:delete"
    };
  },

  saveHearing({
    caseId,
    hearingId
  }: {
    caseId: string;
    hearingId?: string;
  }): CasesMutationSpec<CaseHearingDto, CaseHearingFormValues> {
    return {
      mutationFn: (input) => saveCaseHearing({ caseId, hearingId, input }),
      permission: hearingId ? "hearings:update" : "hearings:create"
    };
  },

  deleteHearing(caseId: string): CasesMutationSpec<{ status: "ok" }, string> {
    return {
      mutationFn: (hearingId) => deleteCaseHearing({ caseId, hearingId }),
      permission: "hearings:delete"
    };
  },

  uploadExpenseAttachment({
    caseId,
    expenseId
  }: {
    caseId: string;
    expenseId: string;
  }): CasesMutationSpec<CaseExpenseAttachmentDto, File> {
    return {
      mutationFn: (file) => uploadCaseExpenseAttachment({ caseId, expenseId, file }),
      permission: "expenses:update"
    };
  },

  deleteExpenseAttachment({
    caseId,
    expenseId
  }: {
    caseId: string;
    expenseId: string;
  }): CasesMutationSpec<{ status: "ok" }, string> {
    return {
      mutationFn: (attachmentId) => deleteCaseExpenseAttachment({ attachmentId, caseId, expenseId }),
      permission: "expenses:update"
    };
  }
};
