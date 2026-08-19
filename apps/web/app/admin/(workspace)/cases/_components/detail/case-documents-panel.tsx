"use client";

import { useEffect, useState } from "react";
import { casesMutations } from "../../_api/cases.mutation-controller";
import { casesQueries } from "../../_api/cases.query-controller";
import { useCaseDocumentsQuery } from "../../_hooks/use-case-documents-query";
import { useCaseDocumentUploads } from "../../_hooks/use-case-document-uploads";
import { useCasesMutation } from "../../_hooks/use-cases-mutation";
import { useCasesQuery } from "../../_hooks/use-cases-query";
import { allCategoriesValue, noCategoryValue } from "../../_constants/case-documents.constants";
import { CaseDocumentsList } from "./case-documents/case-documents-list";
import { CaseDocumentsToolbar } from "./case-documents/case-documents-toolbar";
import { CaseDocumentsUploader } from "./case-documents/case-documents-uploader";
import type { CaseDocumentsPanelProps } from "../../_types/case-document-uploads.types";

export function CaseDocumentsPanel({ canRead, canWrite, caseId }: CaseDocumentsPanelProps) {
  const [categoryFilter, setCategoryFilter] = useState(allCategoriesValue);
  const [selectedCategoryId, setSelectedCategoryId] = useState(noCategoryValue);
  const [notes, setNotes] = useState("");
  const categoryId = categoryFilter === allCategoriesValue ? undefined : categoryFilter;
  const uploadCategoryId = selectedCategoryId === noCategoryValue ? undefined : selectedCategoryId;
  const documentsQuery = useCaseDocumentsQuery({
    caseId,
    categoryId,
    enabled: canRead
  });
  const categoriesQuery = useCasesQuery(casesQueries.documentCategories({ enabled: canRead }));
  const deleteMutation = useCasesMutation(casesMutations.deleteDocument(caseId));
  const uploads = useCaseDocumentUploads(caseId);
  const documents = documentsQuery.data?.items ?? [];
  const categories = categoriesQuery.data?.items ?? [];
  const hasNextPage = Boolean(documentsQuery.data?.pageInfo.hasNextPage);

  useEffect(() => {
    documentsQuery.resetPagination();
  }, [categoryFilter]);

  async function handleFilesSelected(fileList: FileList) {
    await uploads.uploadFiles(fileList, {
      categoryId: uploadCategoryId,
      notes
    });
  }

  async function handleDelete(documentId: string) {
    try {
      await deleteMutation.mutateAsync(documentId);
    } catch {
      // The mutation exposes its error state below.
    }
  }

  if (!canRead) {
    return null;
  }

  return (
    <div data-admin-surface className="rounded-md bg-card p-4 shadow-[var(--admin-card-shadow)]">
      <CaseDocumentsToolbar
        categories={categories}
        categoryFilter={categoryFilter}
        isLoadingCategories={categoriesQuery.isLoading}
        onCategoryFilterChange={setCategoryFilter}
      />

      {canWrite ? (
        <CaseDocumentsUploader
          categories={categories}
          isLoadingCategories={categoriesQuery.isLoading}
          isUploading={uploads.isUploading}
          notes={notes}
          onClearCompleted={uploads.clearCompleted}
          onFilesSelected={handleFilesSelected}
          onNotesChange={setNotes}
          onRemoveUpload={uploads.removeUpload}
          onRetryUpload={(uploadId) => void uploads.retryUpload(uploadId)}
          onSelectedCategoryChange={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
          uploads={uploads.uploads}
        />
      ) : null}

      <CaseDocumentsList
        canGoBack={documentsQuery.canGoBack}
        canWrite={canWrite}
        caseId={caseId}
        documents={documents}
        errorMessage={documentsQuery.error?.message}
        hasNextPage={hasNextPage}
        isDeleting={deleteMutation.isPending}
        isFetching={documentsQuery.isFetching}
        isLoading={documentsQuery.isLoading}
        onDelete={handleDelete}
        onNextPage={documentsQuery.goForward}
        onPreviousPage={documentsQuery.goBack}
        pageIndex={documentsQuery.pageIndex}
      />

      {deleteMutation.error ? (
        <p className="mt-3 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {deleteMutation.error.message}
        </p>
      ) : null}
    </div>
  );
}
