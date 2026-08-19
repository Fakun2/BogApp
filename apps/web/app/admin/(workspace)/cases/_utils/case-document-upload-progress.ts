import {
  documentUploadMinimumVisibleMs,
  documentUploadProgressTickMs
} from "../_constants/case-documents.constants";
import type { PendingCaseDocumentUpload } from "../_types/case-document-uploads.types";

export type PatchDocumentUpload = (
  id: string,
  patch: Partial<Omit<PendingCaseDocumentUpload, "id" | "file">>
) => void;

export function startAvailabilityProgress({
  progressIntervals,
  uploadId,
  patchUpload
}: {
  progressIntervals: Map<string, ReturnType<typeof setInterval>>;
  uploadId: string;
  patchUpload: PatchDocumentUpload;
}) {
  const existingInterval = progressIntervals.get(uploadId);
  if (existingInterval) {
    clearInterval(existingInterval);
  }

  const startedAt = Date.now();
  let displayedProgress = 1;
  const intervalId = setInterval(() => {
    const elapsedRatio = Math.min(1, (Date.now() - startedAt) / documentUploadMinimumVisibleMs);
    const easedRatio = 1 - Math.pow(1 - elapsedRatio, 3);
    const nextProgress = Math.min(96, Math.max(displayedProgress, Math.round(1 + easedRatio * 95)));

    if (nextProgress !== displayedProgress) {
      displayedProgress = nextProgress;
      patchUpload(uploadId, { progress: displayedProgress });
    }
  }, documentUploadProgressTickMs);

  progressIntervals.set(uploadId, intervalId);

  return () => {
    clearInterval(intervalId);
    progressIntervals.delete(uploadId);
  };
}

export function delay(durationMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", abortDelay);
      resolve();
    }, durationMs);

    const abortDelay = () => {
      clearTimeout(timeoutId);
      reject(createAbortError());
    };

    signal?.addEventListener("abort", abortDelay, { once: true });
  });
}

export function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function createAbortError() {
  const error = new Error("La subida del documento fue cancelada.");
  error.name = "AbortError";
  return error;
}
