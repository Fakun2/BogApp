"use client";

import { Download, Eye, FileText, Trash2 } from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from "@/components/ui/attachment";
import {
  getCaseDocumentDownloadUrl,
  getCaseDocumentPreviewUrl
} from "../../../_api/case-documents.api";
import {
  canPreviewDocument,
  canRenderDocumentThumbnail,
  formatDocumentDate,
  formatDocumentSize,
  getDocumentKindLabel
} from "./formatters";
import type { CaseDocumentDto } from "../../../_types/cases.types";

export function CaseDocumentAttachment({
  canWrite,
  caseId,
  document,
  isDeleting,
  onDelete
}: {
  canWrite: boolean;
  caseId: string;
  document: CaseDocumentDto;
  isDeleting: boolean;
  onDelete: (documentId: string) => Promise<void>;
}) {
  const isPreviewable = canPreviewDocument(document);
  const canRenderThumbnail = canRenderDocumentThumbnail(document);
  const previewUrl = getCaseDocumentPreviewUrl({ caseId, documentId: document.id });
  const metadata = [
    document.category?.name ?? "Sin categoria",
    getDocumentKindLabel(document.mimeType),
    formatDocumentSize(document.sizeBytes),
    formatDocumentDate(document.createdAt)
  ].join(" - ");

  return (
    <Attachment className="w-full rounded-md border-border/35 bg-card" size="default">
      <AttachmentMedia variant={canRenderThumbnail ? "image" : "icon"}>
        {canRenderThumbnail ? (
          <img src={previewUrl} alt="" loading="lazy" />
        ) : (
          <FileText className="h-4 w-4" aria-hidden="true" />
        )}
      </AttachmentMedia>
      <AttachmentContent className="py-2">
        <AttachmentTitle>{document.originalName}</AttachmentTitle>
        <AttachmentDescription>{metadata}</AttachmentDescription>
        {document.notes ? (
          <p className="mt-1 line-clamp-2 break-words text-xs text-muted-foreground">
            {document.notes}
          </p>
        ) : null}
      </AttachmentContent>
      <AttachmentActions className="gap-1 pr-2">
        <AttachmentAction
          asChild
          aria-label={`${isPreviewable ? "Visualizar" : "Abrir"} ${document.originalName}`}
          title={isPreviewable ? "Visualizar" : "Abrir"}
          variant="outline"
        >
          <a href={previewUrl} rel="noreferrer" target="_blank">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </AttachmentAction>
        <AttachmentAction
          asChild
          aria-label={`Descargar ${document.originalName}`}
          title="Descargar"
          variant="outline"
        >
          <a href={getCaseDocumentDownloadUrl({ caseId, documentId: document.id })}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </AttachmentAction>
        {canWrite ? (
          <AttachmentAction
            aria-label={`Eliminar ${document.originalName}`}
            className="border-destructive/30 text-destructive hover:text-destructive"
            disabled={isDeleting}
            title="Eliminar"
            variant="outline"
            onClick={() => void onDelete(document.id)}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </AttachmentAction>
        ) : null}
      </AttachmentActions>
    </Attachment>
  );
}
