import { previewableDocumentMimeTypes } from "../../../_constants/case-documents.constants";
import type { CaseDocumentDto } from "../../../_types/cases.types";

const documentDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

export function formatDocumentSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export function formatDocumentDate(value: string) {
  return documentDateFormatter.format(new Date(value));
}

export function canPreviewDocument(document: Pick<CaseDocumentDto, "mimeType">) {
  return previewableDocumentMimeTypes.has(document.mimeType);
}

export function canRenderDocumentThumbnail(document: Pick<CaseDocumentDto, "mimeType">) {
  return document.mimeType.startsWith("image/");
}

export function getDocumentKindLabel(mimeType: string) {
  if (mimeType === "application/pdf") {
    return "PDF";
  }

  if (mimeType.startsWith("image/")) {
    return "Imagen";
  }

  if (mimeType.includes("wordprocessingml") || mimeType === "application/msword") {
    return "Word";
  }

  if (mimeType.includes("spreadsheetml") || mimeType === "application/vnd.ms-excel") {
    return "Excel";
  }

  if (mimeType === "text/plain") {
    return "TXT";
  }

  return "Archivo";
}
