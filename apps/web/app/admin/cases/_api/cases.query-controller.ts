import type { QueryKey } from "@tanstack/react-query";
import type {
  CaseCalendarResponseDto,
  CaseExpenseAttachmentsListResponse,
  CaseExpenseDto,
  CaseExpenseStatus,
  CaseExpensesListResponse,
  CaseExpensesSummaryDto,
  CaseTasksListResponse,
  CasesListResponse,
  CasesQueryParams,
  CatalogResponse,
  TaskAssigneeOption
} from "../_types/cases.types";
import {
  caseKeys,
  getCaseCalendar,
  getCaseExpense,
  getCaseExpensesSummary,
  listCaseExpenseAttachments,
  listCaseExpenses,
  listCases,
  listCaseTasks,
  listCatalogOptions,
  listTaskAssignees
} from "./cases.api";

export type CasesQuerySpec<TData> = {
  enabled?: boolean;
  permission: string;
  queryFn: () => Promise<TData>;
  queryKey: QueryKey;
};

export const casesQueries = {
  list(params: CasesQueryParams): CasesQuerySpec<CasesListResponse> {
    return {
      permission: "cases:read",
      queryKey: caseKeys.list(params),
      queryFn: () => listCases(params)
    };
  },

  catalogOptions<TItem>({
    key,
    params = {},
    path
  }: {
    key: string;
    params?: Record<string, string | number | undefined>;
    path: string;
  }): CasesQuerySpec<CatalogResponse<TItem>> {
    return {
      permission: key === "provinces" ? "provinces:read" : "forums:read",
      queryKey: caseKeys.options(key, params),
      queryFn: () => listCatalogOptions<TItem>({ params, path })
    };
  },

  taskAssignees(): CasesQuerySpec<TaskAssigneeOption[]> {
    return {
      permission: "staff:read",
      queryKey: caseKeys.taskAssignees(),
      queryFn: listTaskAssignees
    };
  },

  tasks({
    caseId,
    cursor,
    limit
  }: {
    caseId: string;
    cursor?: string;
    limit: number;
  }): CasesQuerySpec<CaseTasksListResponse> {
    const params = { cursor, limit };

    return {
      permission: "tasks:read",
      queryKey: caseKeys.tasks(caseId, params),
      queryFn: () => listCaseTasks({ caseId, ...params })
    };
  },

  expenses({
    caseId,
    cursor,
    limit,
    status,
    taskId
  }: {
    caseId: string;
    cursor?: string;
    limit: number;
    status?: CaseExpenseStatus;
    taskId?: string;
  }): CasesQuerySpec<CaseExpensesListResponse> {
    const params = { cursor, limit, status, taskId };

    return {
      permission: "expenses:read",
      queryKey: caseKeys.expenses(caseId, params),
      queryFn: () => listCaseExpenses({ caseId, ...params })
    };
  },

  expense({
    caseId,
    enabled = true,
    expenseId
  }: {
    caseId: string;
    enabled?: boolean;
    expenseId: string;
  }): CasesQuerySpec<CaseExpenseDto> {
    return {
      enabled,
      permission: "expenses:read",
      queryKey: caseKeys.expense(caseId, expenseId),
      queryFn: () => getCaseExpense({ caseId, expenseId })
    };
  },

  expensesSummary(caseId: string): CasesQuerySpec<CaseExpensesSummaryDto> {
    return {
      permission: "expenses:read",
      queryKey: caseKeys.expensesSummary(caseId),
      queryFn: () => getCaseExpensesSummary(caseId)
    };
  },

  calendar({
    caseId,
    cursor,
    enabled,
    limit,
    mode = "month",
    month,
    search,
    types
  }: {
    caseId: string;
    cursor?: string;
    enabled?: boolean;
    limit?: number;
    mode?: "month" | "list";
    month: string;
    search?: string;
    types?: string;
  }): CasesQuerySpec<CaseCalendarResponseDto> {
    const params = { cursor, limit, mode, month, search, types };

    return {
      enabled,
      permission: "expenses:read",
      queryKey: caseKeys.calendar(caseId, params),
      queryFn: () => getCaseCalendar({ caseId, ...params })
    };
  },

  expenseAttachments({
    caseId,
    cursor,
    enabled = true,
    expenseId,
    limit
  }: {
    caseId: string;
    cursor?: string;
    enabled?: boolean;
    expenseId: string;
    limit: number;
  }): CasesQuerySpec<CaseExpenseAttachmentsListResponse> {
    const params = { cursor, limit };

    return {
      enabled,
      permission: "expenses:read",
      queryKey: caseKeys.expenseAttachments(caseId, expenseId, params),
      queryFn: () => listCaseExpenseAttachments({ caseId, expenseId, ...params })
    };
  }
};
