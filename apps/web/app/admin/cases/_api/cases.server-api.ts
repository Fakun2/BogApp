import { getAccessTokenCookie, toApiUrl } from "@/lib/api/server";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import type { BogaapSession } from "@/lib/auth/session";
import type {
  CaseDetailDto,
  CaseExpensesListResponse,
  CaseTasksListResponse,
  CasesMetricsDto,
  CasesListResponse,
  CasesQueryParams
} from "../_types/cases.types";

export async function getCasesServerSession(): Promise<BogaapSession | null> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return null;
  }

  const payload = decodeJwtPayload(accessToken);
  if (!payload.sub) {
    return null;
  }

  return {
    tenantAccess: payload.tenantAccess,
    user: {
      email: payload.email ?? "",
      fullName: payload.email ?? "Usuario",
      id: payload.sub,
      phone: null,
      status: "active"
    }
  };
}

export async function listCasesServer(params: CasesQueryParams): Promise<CasesListResponse> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  return requestCasesServer<CasesListResponse>(`/api/cases?${searchParams.toString()}`);
}

export async function getCaseMetricsServer(): Promise<CasesMetricsDto> {
  return requestCasesServer<CasesMetricsDto>("/api/cases/metrics");
}

export async function getCaseDetailServer(caseId: string): Promise<CaseDetailDto> {
  return requestCasesServer<CaseDetailDto>(`/api/cases/${caseId}`);
}

export async function listCaseTasksServer({
  caseId,
  cursor,
  limit = 8
}: {
  caseId: string;
  cursor?: string;
  limit?: number;
}): Promise<CaseTasksListResponse> {
  const searchParams = new URLSearchParams({ limit: String(limit) });
  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  return requestCasesServer<CaseTasksListResponse>(
    `/api/cases/${caseId}/tasks?${searchParams.toString()}`
  );
}

export async function listCaseExpensesServer({
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
  const searchParams = new URLSearchParams({ limit: String(limit) });
  if (cursor) {
    searchParams.set("cursor", cursor);
  }
  if (taskId) {
    searchParams.set("taskId", taskId);
  }

  return requestCasesServer<CaseExpensesListResponse>(
    `/api/cases/${caseId}/expenses?${searchParams.toString()}`
  );
}

async function requestCasesServer<TResponse>(path: string): Promise<TResponse> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    throw new Error("No hay sesion activa.");
  }

  const payload = decodeJwtPayload(accessToken);
  const tenantId = payload.tenantAccess[0]?.tenantId;
  if (!tenantId) {
    throw new Error("No hay un workspace activo para consultar expedientes.");
  }

  const response = await fetch(toApiUrl(path), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-tenant-id": tenantId
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
    throw new Error(getServerErrorMessage(body?.message, response.status));
  }

  return response.json() as Promise<TResponse>;
}

function getServerErrorMessage(message: unknown, status: number) {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return `No se pudieron cargar los expedientes (${status}).`;
}
