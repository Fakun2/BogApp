import { dashboardHttpClient } from "@/lib/http";
import type {
  CaseExpenseFormValues,
  CaseFormValues,
  CaseTaskFormValues
} from "@/lib/validation/cases";
import type {
  CaseDto,
  CaseExpenseAttachmentDto,
  CaseExpenseAttachmentsListResponse,
  CaseExpenseDto,
  CaseExpensesListResponse,
  CaseTaskDto,
  CaseTasksListResponse,
  CasesListResponse,
  CasesQueryParams,
  CatalogResponse
} from "../_types/cases.types";

export const caseKeys = {
  all: ["cases"] as const,
  detail: (caseId: string) => [...caseKeys.all, "detail", caseId] as const,
  list: (params: CasesQueryParams) => [...caseKeys.all, "list", params] as const,
  options: (key: string, params: Record<string, string | number | undefined>) =>
    ["case-options", key, params] as const,
  expenses: (caseId: string, params?: { cursor?: string; limit?: number; taskId?: string }) =>
    [...caseKeys.detail(caseId), "expenses", params ?? {}] as const,
  expenseAttachments: (caseId: string, expenseId: string) =>
    [...caseKeys.detail(caseId), "expenses", expenseId, "attachments"] as const,
  tasks: (caseId: string, params?: { cursor?: string; limit?: number }) =>
    [...caseKeys.detail(caseId), "tasks", params ?? {}] as const
};

export async function listCases(params: CasesQueryParams): Promise<CasesListResponse> {
  return dashboardHttpClient.request<CasesListResponse>({
    params,
    path: "/cases"
  });
}

export async function listCatalogOptions<TItem>({
  params,
  path
}: {
  params?: Record<string, string | number | undefined>;
  path: string;
}): Promise<CatalogResponse<TItem>> {
  return dashboardHttpClient.request<CatalogResponse<TItem>>({
    params: { limit: 50, offset: 0, sort: "name:asc", ...params },
    path
  });
}

export async function saveCase({
  caseId,
  input
}: {
  caseId?: string;
  input: CaseFormValues;
}): Promise<CaseDto> {
  return dashboardHttpClient.request<CaseDto>({
    body: {
      ...input,
      filingDate: input.filingDate || undefined
    },
    method: caseId ? "PATCH" : "POST",
    path: caseId ? `/cases/${caseId}` : "/cases"
  });
}

export async function deleteCase(caseId: string): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/cases/${caseId}`
  });
}

export async function listCaseTasks({
  caseId,
  cursor,
  limit = 8
}: {
  caseId: string;
  cursor?: string;
  limit?: number;
}): Promise<CaseTasksListResponse> {
  return dashboardHttpClient.request<CaseTasksListResponse>({
    params: { cursor, limit },
    path: `/cases/${caseId}/tasks`
  });
}

export async function saveCaseTask({
  caseId,
  input,
  taskId
}: {
  caseId: string;
  input: CaseTaskFormValues;
  taskId?: string;
}): Promise<CaseTaskDto> {
  return dashboardHttpClient.request<CaseTaskDto>({
    body: {
      ...input,
      endDate: input.endDate || undefined,
      startDate: input.startDate || undefined
    },
    method: taskId ? "PATCH" : "POST",
    path: taskId ? `/cases/${caseId}/tasks/${taskId}` : `/cases/${caseId}/tasks`
  });
}

export async function deleteCaseTask({
  caseId,
  taskId
}: {
  caseId: string;
  taskId: string;
}): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/cases/${caseId}/tasks/${taskId}`
  });
}

export async function listCaseExpenses({
  caseId,
  cursor,
  limit = 8,
  taskId
}: {
  caseId: string;
  cursor?: string;
  limit?: number;
  taskId?: string;
}): Promise<CaseExpensesListResponse> {
  return dashboardHttpClient.request<CaseExpensesListResponse>({
    params: { cursor, limit, taskId },
    path: `/cases/${caseId}/expenses`
  });
}

export async function saveCaseExpense({
  caseId,
  expenseId,
  input
}: {
  caseId: string;
  expenseId?: string;
  input: CaseExpenseFormValues;
}): Promise<CaseExpenseDto> {
  return dashboardHttpClient.request<CaseExpenseDto>({
    body: {
      ...input,
      taskId: input.taskId || undefined
    },
    method: expenseId ? "PATCH" : "POST",
    path: expenseId ? `/cases/${caseId}/expenses/${expenseId}` : `/cases/${caseId}/expenses`
  });
}

export async function deleteCaseExpense({
  caseId,
  expenseId
}: {
  caseId: string;
  expenseId: string;
}): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/cases/${caseId}/expenses/${expenseId}`
  });
}

export async function listCaseExpenseAttachments({
  caseId,
  expenseId
}: {
  caseId: string;
  expenseId: string;
}): Promise<CaseExpenseAttachmentsListResponse> {
  return dashboardHttpClient.request<CaseExpenseAttachmentsListResponse>({
    path: `/cases/${caseId}/expenses/${expenseId}/attachments`
  });
}

export async function uploadCaseExpenseAttachment({
  caseId,
  expenseId,
  file
}: {
  caseId: string;
  expenseId: string;
  file: File;
}): Promise<CaseExpenseAttachmentDto> {
  const body = new FormData();
  body.set("file", file);

  const response = await fetch(`/api/cases/${caseId}/expenses/${expenseId}/attachments`, {
    body,
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await getUploadErrorMessage(response));
  }

  return response.json() as Promise<CaseExpenseAttachmentDto>;
}

export async function deleteCaseExpenseAttachment({
  attachmentId,
  caseId,
  expenseId
}: {
  attachmentId: string;
  caseId: string;
  expenseId: string;
}): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/cases/${caseId}/expenses/${expenseId}/attachments/${attachmentId}`
  });
}

export function getCaseExpenseAttachmentDownloadUrl({
  attachmentId,
  caseId,
  expenseId
}: {
  attachmentId: string;
  caseId: string;
  expenseId: string;
}) {
  return `/api/cases/${caseId}/expenses/${expenseId}/attachments/${attachmentId}/download`;
}

async function getUploadErrorMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  if (typeof body?.message === "string") {
    return body.message;
  }

  if (Array.isArray(body?.message)) {
    return body.message.join(" ");
  }

  return `No se pudo subir el comprobante (${response.status}).`;
}
