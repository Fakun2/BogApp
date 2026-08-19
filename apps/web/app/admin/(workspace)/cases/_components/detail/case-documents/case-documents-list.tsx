"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CaseDocumentAttachment } from "./case-document-attachment";
import type { CaseDocumentDto } from "../../../_types/cases.types";

export function CaseDocumentsList({
  canGoBack,
  canWrite,
  caseId,
  documents,
  errorMessage,
  hasNextPage,
  isDeleting,
  isFetching,
  isLoading,
  onDelete,
  onNextPage,
  onPreviousPage,
  pageIndex
}: {
  canGoBack: boolean;
  canWrite: boolean;
  caseId: string;
  documents: CaseDocumentDto[];
  errorMessage?: string;
  hasNextPage: boolean;
  isDeleting: boolean;
  isFetching: boolean;
  isLoading: boolean;
  onDelete: (documentId: string) => Promise<void>;
  onNextPage: () => void;
  onPreviousPage: () => void;
  pageIndex: number;
}) {
  return (
    <>
      <div className="pt-4">
        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-16 rounded-md" key={index} />
            ))}
          </div>
        ) : errorMessage ? (
          <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {errorMessage}
          </p>
        ) : documents.length > 0 ? (
          <div className="grid gap-2">
            {documents.map((document) => (
              <CaseDocumentAttachment
                canWrite={canWrite}
                caseId={caseId}
                document={document}
                isDeleting={isDeleting}
                key={document.id}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center rounded-md border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
            Todavia no hay documentos cargados para este expediente.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/30 pt-3 text-sm text-muted-foreground">
        <span>
          Pagina {pageIndex + 1} - {documents.length} documentos
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 border-border/50 p-0"
            disabled={!canGoBack || isFetching}
            onClick={onPreviousPage}
            aria-label="Pagina anterior"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 border-border/50 p-0"
            disabled={!hasNextPage || isFetching}
            onClick={onNextPage}
            aria-label="Pagina siguiente"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}
