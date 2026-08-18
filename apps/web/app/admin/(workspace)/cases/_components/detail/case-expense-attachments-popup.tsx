"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCaseExpenseAttachmentDownloadUrl } from "../../_api/cases.api";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";
import { useCaseExpenseAttachmentsQuery } from "../../_hooks/use-case-expense-attachments-query";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import type { CaseExpenseDto } from "../../_types/cases.types";

const acceptedAttachmentTypes = "application/pdf,image/jpeg,image/png,image/webp";

export function CaseExpenseAttachmentsPopup({
  canUpdate,
  caseId,
  expense,
  onClose
}: {
  canUpdate: boolean;
  caseId: string;
  expense: CaseExpenseDto;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsQuery = useCaseExpenseAttachmentsQuery({
    caseId,
    expenseId: expense.id
  });
  const uploadMutation = useCasesMutation(
    casesMutations.uploadExpenseAttachment({ caseId, expenseId: expense.id })
  );
  const deleteMutation = useCasesMutation(
    casesMutations.deleteExpenseAttachment({ caseId, expenseId: expense.id })
  );
  const attachments = attachmentsQuery.data?.items ?? [];
  const hasNextPage = Boolean(attachmentsQuery.data?.pageInfo.hasNextPage);

  useEffect(() => {
    setMounted(true);
    const frame = window.requestAnimationFrame(() => setIsVisible(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  }

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) {
      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // The mutation exposes its error state below.
    }
  }

  async function handleDelete(attachmentId: string) {
    try {
      await deleteMutation.mutateAsync(attachmentId);
    } catch {
      // The mutation exposes its error state below.
    }
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-200 ease-out ${
        isClosing || !isVisible ? "opacity-0 backdrop-blur-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Comprobantes de ${expense.concept}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        data-admin-surface
        className={`flex max-h-[82svh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--admin-card-shadow)] transition-[opacity,transform] duration-200 ease-out ${
          isClosing || !isVisible
            ? "translate-y-2 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/30 px-5 py-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 truncate text-base font-semibold text-foreground">
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              Comprobantes
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">{expense.concept}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 border-border/50 p-0"
            onClick={requestClose}
            aria-label="Cerrar comprobantes"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-5 py-4">
          {canUpdate ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-4">
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept={acceptedAttachmentTypes}
                onChange={(event) => void handleFileChange(event.target.files)}
              />
              <Button
                type="button"
                className={`h-10 w-full justify-center px-3 sm:gap-2 sm:px-4 ${adminPrimaryActionButtonClassName}`}
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Subir comprobante</span>
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                PDF, JPG, PNG o WebP. Maximo 10 MB.
              </p>
            </div>
          ) : null}

          {attachmentsQuery.isLoading ? (
            <div className="grid gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton className="h-14 rounded-2xl" key={index} />
              ))}
            </div>
          ) : attachmentsQuery.error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {attachmentsQuery.error.message}
            </p>
          ) : attachments.length ? (
            <div className="grid gap-2">
              {attachments.map((attachment) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/35 px-4 py-3"
                  key={attachment.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatAttachmentSize(attachment.sizeBytes)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      asChild
                      type="button"
                      variant="outline"
                      className="h-8 w-8 border-border/50 p-0"
                      aria-label={`Descargar ${attachment.originalName}`}
                    >
                      <a
                        href={getCaseExpenseAttachmentDownloadUrl({
                          attachmentId: attachment.id,
                          caseId,
                          expenseId: expense.id
                        })}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                    {canUpdate ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 w-8 border-destructive/30 p-0 text-destructive hover:text-destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => void handleDelete(attachment.id)}
                        aria-label={`Eliminar ${attachment.originalName}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
              Todavia no hay comprobantes cargados para este gasto.
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border/30 pt-3 text-sm text-muted-foreground">
            <span>
              Pagina {attachmentsQuery.pageIndex + 1} - {attachments.length} comprobantes
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 border-border/50 p-0"
                disabled={!attachmentsQuery.canGoBack || attachmentsQuery.isFetching}
                onClick={attachmentsQuery.goBack}
                aria-label="Pagina anterior"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 border-border/50 p-0"
                disabled={!hasNextPage || attachmentsQuery.isFetching}
                onClick={attachmentsQuery.goForward}
                aria-label="Pagina siguiente"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {uploadMutation.error || deleteMutation.error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {uploadMutation.error?.message ?? deleteMutation.error?.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatAttachmentSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
