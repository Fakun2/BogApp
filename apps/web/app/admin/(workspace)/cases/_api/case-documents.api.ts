import { dashboardHttpClient } from "@/lib/http";
import type {
  CaseDocumentDto,
  CaseDocumentsListResponse,
  DocumentCategoriesListResponse
} from "../_types/cases.types";

export async function listDocumentCategories({
  active = true,
  cursor,
  limit = 50
}: {
  active?: boolean;
  cursor?: string;
  limit?: number;
} = {}): Promise<DocumentCategoriesListResponse> {
  return dashboardHttpClient.request<DocumentCategoriesListResponse>({
    params: { active, cursor, limit },
    path: "/document-categories"
  });
}

export async function listCaseDocuments({
  caseId,
  categoryId,
  cursor,
  limit = 8
}: {
  caseId: string;
  categoryId?: string;
  cursor?: string;
  limit?: number;
}): Promise<CaseDocumentsListResponse> {
  return dashboardHttpClient.request<CaseDocumentsListResponse>({
    params: { categoryId, cursor, limit },
    path: `/cases/${caseId}/documents`
  });
}

export async function uploadCaseDocument({
  caseId,
  categoryId,
  file,
  notes
}: {
  caseId: string;
  categoryId?: string;
  file: File;
  notes?: string;
}): Promise<CaseDocumentDto> {
  const body = createCaseDocumentFormData({ categoryId, file, notes });

  const response = await fetch(`/api/cases/${caseId}/documents`, {
    body,
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await getUploadErrorMessage(response, "documento"));
  }

  return response.json() as Promise<CaseDocumentDto>;
}

export async function uploadCaseDocumentWithProgress({
  caseId,
  categoryId,
  file,
  notes,
  onProgress,
  signal
}: {
  caseId: string;
  categoryId?: string;
  file: File;
  notes?: string;
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}): Promise<CaseDocumentDto> {
  const body = createCaseDocumentFormData({ categoryId, file, notes });

  return new Promise<CaseDocumentDto>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const request = new XMLHttpRequest();
    request.open("POST", `/api/cases/${caseId}/documents`);
    request.responseType = "json";

    const removeAbortListener = () => {
      signal?.removeEventListener("abort", abortRequest);
    };
    const abortRequest = () => {
      request.abort();
    };

    signal?.addEventListener("abort", abortRequest, { once: true });

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) {
        return;
      }

      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    };

    request.onload = () => {
      removeAbortListener();

      if (request.status >= 200 && request.status < 300) {
        onProgress(100);
        resolve(request.response as CaseDocumentDto);
        return;
      }

      reject(
        new Error(getUploadErrorMessageFromBody(request.response, request.status, "documento"))
      );
    };

    request.onerror = () => {
      removeAbortListener();
      reject(new Error("No se pudo subir el documento."));
    };

    request.onabort = () => {
      removeAbortListener();
      reject(createAbortError());
    };

    request.send(body);
  });
}

export async function deleteCaseDocument({
  caseId,
  documentId
}: {
  caseId: string;
  documentId: string;
}): Promise<{ status: "ok" }> {
  return dashboardHttpClient.request<{ status: "ok" }>({
    method: "DELETE",
    path: `/cases/${caseId}/documents/${documentId}`
  });
}

export function getCaseDocumentPreviewUrl({
  caseId,
  documentId
}: {
  caseId: string;
  documentId: string;
}) {
  return `/api/cases/${caseId}/documents/${documentId}/preview`;
}

export function getCaseDocumentDownloadUrl({
  caseId,
  documentId
}: {
  caseId: string;
  documentId: string;
}) {
  return `/api/cases/${caseId}/documents/${documentId}/download`;
}

function createCaseDocumentFormData({
  categoryId,
  file,
  notes
}: {
  categoryId?: string;
  file: File;
  notes?: string;
}) {
  const body = new FormData();
  body.set("file", file);
  if (categoryId) {
    body.set("categoryId", categoryId);
  }
  if (notes?.trim()) {
    body.set("notes", notes.trim());
  }

  return body;
}

async function getUploadErrorMessage(response: Response, label = "comprobante") {
  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  return getUploadErrorMessageFromBody(body, response.status, label);
}

function getUploadErrorMessageFromBody(body: unknown, status: number, label = "comprobante") {
  const responseBody = body as { message?: unknown } | null;

  if (typeof responseBody?.message === "string") {
    return responseBody.message;
  }

  if (Array.isArray(responseBody?.message)) {
    return responseBody.message.join(" ");
  }

  return `No se pudo subir el ${label} (${status}).`;
}

function createAbortError() {
  const error = new Error("La subida del documento fue cancelada.");
  error.name = "AbortError";
  return error;
}
