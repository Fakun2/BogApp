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
  const errorMessage = getDocumentUploadValidationError(file);
  const status: CaseDocumentUploadStatus = errorMessage ? "error" : "queued";

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
  return !getDocumentUploadValidationError(file);
}

export function getDocumentUploadValidationError(file: File) {
  if (!acceptedMimeTypeSet.has(file.type)) {
    return "El documento debe ser PDF, imagen, Word, Excel o PowerPoint.";
  }

  if (file.size > maxCaseDocumentSizeBytes) {
    return "El documento no puede superar 25 MB.";
  }

  return undefined;
}

export function revokeUploadPreviewUrl(upload: Pick<PendingCaseDocumentUpload, "previewUrl">) {
  if (upload.previewUrl) {
    URL.revokeObjectURL(upload.previewUrl);
  }
}

function createUploadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
