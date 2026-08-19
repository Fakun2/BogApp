"use client";

import { AlertCircle, CheckCircle2, FileUp, Loader2, RotateCcw, X } from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from "@/components/ui/attachment";
import { canRenderDocumentThumbnail, formatDocumentSize, getDocumentKindLabel } from "./formatters";
import type { PendingCaseDocumentUpload } from "../../../_types/case-document-uploads.types";

export function CaseDocumentUploadItem({
  onRemove,
  onRetry,
  upload
}: {
  onRemove: (uploadId: string) => void;
  onRetry: (uploadId: string) => void;
  upload: PendingCaseDocumentUpload;
}) {
  return (
    <Attachment
      className="w-[280px] rounded-md border-border/50 bg-background"
      state={upload.status === "queued" ? "idle" : upload.status}
      size="sm"
    >
      <AttachmentMedia variant={upload.previewUrl ? "image" : "icon"}>
        {upload.previewUrl ? (
          <img src={upload.previewUrl} alt="" />
        ) : upload.status === "uploading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : upload.status === "done" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        ) : upload.status === "error" ? (
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
        ) : (
          <FileUp className="h-4 w-4" aria-hidden="true" />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{upload.originalName}</AttachmentTitle>
        <AttachmentDescription>
          {upload.errorMessage ?? uploadStatusLabel(upload)}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {upload.status === "error" ? (
          <AttachmentAction
            aria-label={`Reintentar ${upload.originalName}`}
            title="Reintentar"
            onClick={() => onRetry(upload.id)}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </AttachmentAction>
        ) : null}
        <AttachmentAction
          aria-label={`Quitar ${upload.originalName}`}
          title="Quitar"
          onClick={() => onRemove(upload.id)}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

function uploadStatusLabel(upload: PendingCaseDocumentUpload) {
  const kind = getDocumentKindLabel(upload.mimeType);
  const size = formatDocumentSize(upload.sizeBytes);

  if (upload.status === "queued") {
    return `En cola - ${kind} - ${size}`;
  }

  if (upload.status === "uploading") {
    return `${upload.progress}% - ${kind} - ${size}`;
  }

  if (upload.status === "done") {
    return `Subido - ${kind} - ${size}`;
  }

  return `${canRenderDocumentThumbnail(upload) ? "Imagen" : kind} - ${size}`;
}
