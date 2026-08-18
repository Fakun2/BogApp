import {
  acceptedDocumentMimeTypes,
  maxCaseDocumentSizeBytes
} from "../_constants/case-documents.constants";
import { canRenderDocumentThumbnail } from "../_components/detail/case-documents/formatters";
import type {
  CaseDocumentUploadStatus,
  PendingCaseDocumentUpload
} from "../_types/case-document-uploads.types";

const acceptedMimeTypeSet = new Set<string>(acceptedDocumentMimeTypes);

export function createPendingDocumentUpload({
  categoryId,
  file,
  notes
}: {
  categoryId?: string;
  file: File;
  notes?: string;
}): PendingCaseDocumentUpload {
  const errorMessage = getClientUploadError(file);
  const status: CaseDocumentUploadStatus = errorMessage ? "error" : "idle";

  return {
    categoryId,
    errorMessage,
    file,
    id: createUploadId(),
    mimeType: file.type || "application/octet-stream",
    notes,
    originalName: file.name,
    previewUrl: canRenderDocumentThumbnail({ mimeType: file.type })
      ? URL.createObjectURL(file)
      : undefined,
    progress: 0,
    sizeBytes: file.size,
    status
  };
}

export function isUploadableDocumentFile(file: File) {
  return acceptedMimeTypeSet.has(file.type);
}

export function revokeUploadPreviewUrl(upload: Pick<PendingCaseDocumentUpload, "previewUrl">) {
  if (upload.previewUrl) {
    URL.revokeObjectURL(upload.previewUrl);
  }
}

function getClientUploadError(file: File) {
  if (!isUploadableDocumentFile(file)) {
    return "El documento debe ser PDF, imagen, Word, Excel o TXT.";
  }

  if (file.size > maxCaseDocumentSizeBytes) {
    return "El documento no puede superar 25 MB.";
  }

  return undefined;
}

function createUploadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
