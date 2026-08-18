"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadCaseDocumentWithProgress } from "../_api/case-documents.api";
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
  isUploadableDocumentFile,
  revokeUploadPreviewUrl
} from "../_utils/case-document-upload-validation";
import { delay, startAvailabilityProgress } from "../_utils/case-document-upload-progress";
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

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
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
      await delay(documentUploadStartDelayMs);
      patchUpload(upload.id, { errorMessage: undefined, progress: 1, status: "uploading" });
      const stopAvailabilityProgress = startAvailabilityProgress({
        progressIntervals: progressIntervalsRef.current,
        uploadId: upload.id,
        patchUpload
      });

      try {
        const [uploadedDocument] = await Promise.all([
          uploadCaseDocumentWithProgress({
            caseId,
            categoryId: upload.categoryId,
            file: upload.file,
            notes: upload.notes,
            onProgress: () => {
              // Progress is intentionally paced by the UI so quick uploads remain readable.
            }
          }),
          delay(documentUploadMinimumVisibleMs)
        ]);
        stopAvailabilityProgress();
        patchUpload(upload.id, {
          completedAt: Date.now(),
          progress: 100,
          status: "done",
          uploadedDocument
        });
        upsertDocumentIntoCaseDocumentQueries(queryClient, caseId, uploadedDocument);
        scheduleCompletedUploadRemoval(upload, cleanupTimeoutsRef.current, setUploads);
      } catch (error) {
        stopAvailabilityProgress();
        patchUpload(upload.id, {
          errorMessage: getErrorMessage(error),
          progress: 0,
          status: "error"
        });
      }
    },
    [caseId, patchUpload, queryClient]
  );

  const runQueue = useCallback(
    async (queue: PendingCaseDocumentUpload[]) => {
      let nextIndex = 0;
      const workerCount = Math.min(maxConcurrentDocumentUploads, queue.length);
      const workers = Array.from({ length: workerCount }, async () => {
        while (nextIndex < queue.length) {
          const upload = queue[nextIndex];
          nextIndex += 1;
          if (!upload) {
            continue;
          }

          await uploadOne(upload);
        }
      });

      await Promise.all(workers);
      await queryClient.invalidateQueries({
        predicate: (query) => isCaseDocumentsQuery(query.queryKey, caseId)
      });
      await queryClient.refetchQueries({
        predicate: (query) => isCaseDocumentsQuery(query.queryKey, caseId),
        type: "active"
      });
    },
    [caseId, queryClient, uploadOne]
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

      const uploadable = nextUploads.filter((upload) => upload.status === "idle");
      if (uploadable.length > 0) {
        await runQueue(uploadable);
      }
    },
    [runQueue]
  );

  const retryUpload = useCallback(
    async (uploadId: string) => {
      const upload = uploadsRef.current.find((item) => item.id === uploadId);
      if (!upload || upload.status !== "error" || !isUploadableDocumentFile(upload.file)) {
        return;
      }

      await runQueue([upload]);
    },
    [runQueue]
  );

  const removeUpload = useCallback((uploadId: string) => {
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
    isUploading: uploads.some((upload) => upload.status === "uploading"),
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
