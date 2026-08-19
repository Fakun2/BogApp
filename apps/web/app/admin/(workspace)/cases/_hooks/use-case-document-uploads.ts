"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCaseDocument, uploadCaseDocumentWithProgress } from "../_api/case-documents.api";
import {
  completedDocumentUploadTtlMs,
  documentUploadMinimumVisibleMs,
  documentUploadStartDelayMs,
  maxConcurrentDocumentUploads
} from "../_constants/case-documents.constants";
import {
  isCaseDocumentsQuery,
  upsertDocumentIntoCaseDocumentQueries
} from "../_utils/case-document-query-cache";
import {
  createPendingDocumentUpload,
  getDocumentUploadValidationError,
  revokeUploadPreviewUrl
} from "../_utils/case-document-upload-validation";
import {
  delay,
  isAbortError,
  startAvailabilityProgress
} from "../_utils/case-document-upload-progress";
import type { CaseDocumentDto } from "../_types/cases.types";
import type { PendingCaseDocumentUpload } from "../_types/case-document-uploads.types";

type UploadInput = {
  categoryId?: string;
  notes?: string;
};

export function useCaseDocumentUploads(caseId: string) {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = useState<PendingCaseDocumentUpload[]>([]);
  const uploadsRef = useRef(uploads);
  const cleanupTimeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const progressIntervalsRef = useRef(new Map<string, ReturnType<typeof setInterval>>());
  const uploadQueueRef = useRef<PendingCaseDocumentUpload[]>([]);
  const activeUploadCountRef = useRef(0);
  const hasCompletedUploadSinceLastRefreshRef = useRef(false);
  const canceledUploadIdsRef = useRef(new Set<string>());
  const uploadAbortControllersRef = useRef(new Map<string, AbortController>());
  const startQueueWorkersRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((upload) => canceledUploadIdsRef.current.add(upload.id));
      uploadQueueRef.current = [];
      uploadAbortControllersRef.current.forEach((controller) => controller.abort());
      cleanupTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      progressIntervalsRef.current.forEach((intervalId) => clearInterval(intervalId));
      uploadsRef.current.forEach((upload) => revokeUploadPreviewUrl(upload));
    };
  }, []);

  const patchUpload = useCallback(
    (id: string, patch: Partial<Omit<PendingCaseDocumentUpload, "id" | "file">>) => {
      setUploads((current) =>
        current.map((upload) => (upload.id === id ? { ...upload, ...patch } : upload))
      );
    },
    []
  );

  const uploadOne = useCallback(
    async (upload: PendingCaseDocumentUpload) => {
      if (canceledUploadIdsRef.current.has(upload.id)) {
        canceledUploadIdsRef.current.delete(upload.id);
        return false;
      }

      const abortController = new AbortController();
      uploadAbortControllersRef.current.set(upload.id, abortController);
      let stopAvailabilityProgress: (() => void) | undefined;
      let uploadedDocument: CaseDocumentDto | undefined;

      try {
        await delay(documentUploadStartDelayMs, abortController.signal);
        if (canceledUploadIdsRef.current.has(upload.id)) {
          return false;
        }

        patchUpload(upload.id, { errorMessage: undefined, progress: 1, status: "uploading" });
        stopAvailabilityProgress = startAvailabilityProgress({
          progressIntervals: progressIntervalsRef.current,
          uploadId: upload.id,
          patchUpload
        });

        const [createdDocument] = await Promise.all([
          uploadCaseDocumentWithProgress({
            caseId,
            categoryId: upload.categoryId,
            file: upload.file,
            notes: upload.notes,
            onProgress: () => {
              // Progress is intentionally paced by the UI so quick uploads remain readable.
            },
            signal: abortController.signal
          }).then((document) => {
            uploadedDocument = document;
            return document;
          }),
          delay(documentUploadMinimumVisibleMs, abortController.signal)
        ]);
        if (canceledUploadIdsRef.current.has(upload.id)) {
          return false;
        }

        stopAvailabilityProgress();
        stopAvailabilityProgress = undefined;
        patchUpload(upload.id, {
          completedAt: Date.now(),
          progress: 100,
          status: "done",
          uploadedDocument: createdDocument
        });
        upsertDocumentIntoCaseDocumentQueries(queryClient, caseId, createdDocument);
        scheduleCompletedUploadRemoval(upload, cleanupTimeoutsRef.current, setUploads);
        return true;
      } catch (error) {
        if (isAbortError(error) || canceledUploadIdsRef.current.has(upload.id)) {
          await deleteUploadedDocumentAfterCancellation(caseId, uploadedDocument);
          return false;
        }

        patchUpload(upload.id, {
          errorMessage: getErrorMessage(error),
          progress: 0,
          status: "error"
        });
        return false;
      } finally {
        stopAvailabilityProgress?.();
        canceledUploadIdsRef.current.delete(upload.id);
        uploadAbortControllersRef.current.delete(upload.id);
      }
    },
    [caseId, patchUpload, queryClient]
  );

  const refreshDocumentsAfterQueueDrains = useCallback(async () => {
    if (!hasCompletedUploadSinceLastRefreshRef.current) {
      return;
    }

    hasCompletedUploadSinceLastRefreshRef.current = false;
    await queryClient.invalidateQueries({
      predicate: (query) => isCaseDocumentsQuery(query.queryKey, caseId)
    });
    await queryClient.refetchQueries({
      predicate: (query) => isCaseDocumentsQuery(query.queryKey, caseId),
      type: "active"
    });
  }, [caseId, queryClient]);

  const processQueuedUpload = useCallback(
    async (upload: PendingCaseDocumentUpload) => {
      activeUploadCountRef.current += 1;

      try {
        const didUpload = await uploadOne(upload);
        hasCompletedUploadSinceLastRefreshRef.current =
          didUpload || hasCompletedUploadSinceLastRefreshRef.current;
      } finally {
        activeUploadCountRef.current = Math.max(0, activeUploadCountRef.current - 1);

        if (uploadQueueRef.current.length > 0) {
          startQueueWorkersRef.current();
        } else if (activeUploadCountRef.current === 0) {
          void refreshDocumentsAfterQueueDrains();
        }
      }
    },
    [refreshDocumentsAfterQueueDrains, uploadOne]
  );

  const startQueueWorkers = useCallback(() => {
    while (
      activeUploadCountRef.current < maxConcurrentDocumentUploads &&
      uploadQueueRef.current.length > 0
    ) {
      const upload = uploadQueueRef.current.shift();
      if (!upload || canceledUploadIdsRef.current.has(upload.id)) {
        if (upload) {
          canceledUploadIdsRef.current.delete(upload.id);
        }
        continue;
      }

      void processQueuedUpload(upload);
    }
  }, [processQueuedUpload]);

  useEffect(() => {
    startQueueWorkersRef.current = startQueueWorkers;
  }, [startQueueWorkers]);

  const enqueueUploads = useCallback(
    (nextUploads: PendingCaseDocumentUpload[]) => {
      const uploadable = nextUploads.filter((upload) => upload.status === "queued");
      if (uploadable.length === 0) {
        return;
      }

      uploadQueueRef.current.push(...uploadable);
      setUploads((current) =>
        current.map((upload) =>
          uploadable.some((queuedUpload) => queuedUpload.id === upload.id)
            ? { ...upload, errorMessage: undefined, progress: 0, status: "queued" }
            : upload
        )
      );
      startQueueWorkers();
    },
    [startQueueWorkers]
  );

  const uploadFiles = useCallback(
    async (fileList: FileList | File[], input: UploadInput) => {
      const nextUploads = Array.from(fileList).map((file) =>
        createPendingDocumentUpload({
          categoryId: input.categoryId,
          file,
          notes: input.notes
        })
      );

      if (nextUploads.length === 0) {
        return;
      }

      setUploads((current) => [...nextUploads, ...current]);

      enqueueUploads(nextUploads);
    },
    [enqueueUploads]
  );

  const retryUpload = useCallback(
    async (uploadId: string) => {
      const upload = uploadsRef.current.find((item) => item.id === uploadId);
      if (!upload || upload.status !== "error") {
        return;
      }

      const validationError = getDocumentUploadValidationError(upload.file);
      if (validationError) {
        patchUpload(upload.id, {
          errorMessage: validationError,
          progress: 0,
          status: "error"
        });
        return;
      }

      canceledUploadIdsRef.current.delete(upload.id);
      enqueueUploads([{ ...upload, errorMessage: undefined, progress: 0, status: "queued" }]);
    },
    [enqueueUploads, patchUpload]
  );

  const removeUpload = useCallback((uploadId: string) => {
    const currentUpload = uploadsRef.current.find((upload) => upload.id === uploadId);
    const activeAbortController = uploadAbortControllersRef.current.get(uploadId);
    const isQueued = uploadQueueRef.current.some((upload) => upload.id === uploadId);
    if (
      isQueued ||
      activeAbortController ||
      currentUpload?.status === "queued" ||
      currentUpload?.status === "uploading"
    ) {
      canceledUploadIdsRef.current.add(uploadId);
      uploadQueueRef.current = uploadQueueRef.current.filter((upload) => upload.id !== uploadId);
      activeAbortController?.abort();
      uploadAbortControllersRef.current.delete(uploadId);
    }

    const timeoutId = cleanupTimeoutsRef.current.get(uploadId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      cleanupTimeoutsRef.current.delete(uploadId);
    }

    setUploads((current) => {
      const upload = current.find((item) => item.id === uploadId);
      if (upload) {
        revokeUploadPreviewUrl(upload);
      }

      return current.filter((item) => item.id !== uploadId);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((current) => {
      current.forEach((upload) => {
        if (upload.status === "done") {
          const timeoutId = cleanupTimeoutsRef.current.get(upload.id);
          if (timeoutId) {
            clearTimeout(timeoutId);
            cleanupTimeoutsRef.current.delete(upload.id);
          }
          revokeUploadPreviewUrl(upload);
        }
      });

      return current.filter((upload) => upload.status !== "done");
    });
  }, []);

  return {
    clearCompleted,
    isUploading: uploads.some(
      (upload) => upload.status === "queued" || upload.status === "uploading"
    ),
    removeUpload,
    retryUpload,
    uploadFiles,
    uploads
  };
}

function scheduleCompletedUploadRemoval(
  upload: PendingCaseDocumentUpload,
  cleanupTimeouts: Map<string, ReturnType<typeof setTimeout>>,
  setUploads: Dispatch<SetStateAction<PendingCaseDocumentUpload[]>>
) {
  const existingTimeout = cleanupTimeouts.get(upload.id);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeoutId = setTimeout(() => {
    setUploads((current) => {
      const completedUpload = current.find((item) => item.id === upload.id);
      if (completedUpload?.status === "done") {
        revokeUploadPreviewUrl(completedUpload);
      }

      return current.filter((item) => item.id !== upload.id || item.status !== "done");
    });
    cleanupTimeouts.delete(upload.id);
  }, completedDocumentUploadTtlMs);

  cleanupTimeouts.set(upload.id, timeoutId);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo subir el documento.";
}

async function deleteUploadedDocumentAfterCancellation(caseId: string, document?: CaseDocumentDto) {
  if (!document) {
    return;
  }

  await deleteCaseDocument({ caseId, documentId: document.id }).catch(() => undefined);
}
