"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  cancelImportJob,
  createImportJob,
  libraryKeys,
  uploadImportItems
} from "../_api/library.api";
import type { DocumentImportJobDto } from "../_types/library.types";
import type {
  DirectoryPickerWindow,
  LibraryImportFile,
  LibraryImportPhase,
  OmittedLibraryImportFile
} from "../_types/library-import.types";
import {
  getDroppedImportFiles,
  getImportSummary,
  prepareImportFiles,
  readDirectoryHandleFiles
} from "../_utils/library-import";

const importBatchSize = 10;

export function useLibraryImportController({
  folderId,
  onCompleted
}: {
  folderId: string | null;
  onCompleted: () => void;
}) {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<LibraryImportPhase>("idle");
  const [files, setFiles] = useState<LibraryImportFile[]>([]);
  const [omittedFiles, setOmittedFiles] = useState<OmittedLibraryImportFile[]>([]);
  const [job, setJob] = useState<DocumentImportJobDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const summary = useMemo(() => getImportSummary(files, omittedFiles), [files, omittedFiles]);
  const progress = job?.totalFiles ? Math.round((job.processedFiles / job.totalFiles) * 100) : 0;
  const importing = phase === "uploading";
  const importFinished = phase === "completed" || phase === "canceled" || Boolean(job?.completedAt);
  const canStartImport = phase === "prepared" && files.length > 0 && !importing && !importFinished;

  function reset() {
    setFiles([]);
    setOmittedFiles([]);
    setJob(null);
    setError(null);
    setDragActive(false);
    setPhase("idle");
  }

  function mergeSelectedFiles(nextFiles: File[]) {
    const appendToCurrentSelection = phase === "prepared";
    const prepared = prepareImportFiles(
      nextFiles,
      appendToCurrentSelection ? files : [],
      appendToCurrentSelection ? omittedFiles : []
    );

    setJob(null);
    setError(null);
    setFiles(prepared.files);
    setOmittedFiles(prepared.omittedFiles);
    setPhase("prepared");
  }

  function handleFallbackFilesSelected(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []);
    if (nextFiles.length) {
      mergeSelectedFiles(nextFiles);
    }
  }

  async function selectFolderFromPicker() {
    const picker = (window as DirectoryPickerWindow).showDirectoryPicker;
    if (!picker) {
      return false;
    }

    try {
      const directory = await picker();
      const nextFiles = await readDirectoryHandleFiles(directory, directory.name);
      mergeSelectedFiles(nextFiles);
      return true;
    } catch (currentError) {
      if (currentError instanceof DOMException && currentError.name === "AbortError") {
        return true;
      }
      setError(currentError instanceof Error ? currentError.message : "No se pudo leer la carpeta seleccionada.");
      return true;
    }
  }

  async function handleDroppedFiles(dataTransfer: DataTransfer) {
    setDragActive(false);
    const droppedFiles = await getDroppedImportFiles(dataTransfer);
    if (droppedFiles.length) {
      mergeSelectedFiles(droppedFiles);
    }
  }

  async function startImport() {
    if (!files.length) {
      return;
    }

    setPhase("uploading");
    setError(null);

    try {
      let nextJob = await createImportJob({
        folderId,
        totalBytes: summary.totalBytes,
        totalFiles: files.length
      });
      setJob(nextJob);

      for (let index = 0; index < files.length; index += importBatchSize) {
        const batch = files.slice(index, index + importBatchSize);
        nextJob = await uploadImportItems({
          files: batch.map((item) => item.file),
          importJobId: nextJob.id,
          isFinalBatch: index + importBatchSize >= files.length,
          relativePaths: batch.map((item) => item.relativePath)
        });
        setJob(nextJob);
      }

      setPhase(nextJob.status === "partial_failed" ? "failed" : "completed");
      await invalidateLibraryQueries();
      onCompleted();
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "No se pudo completar la importacion.");
      setPhase("failed");
    }
  }

  async function cancelImport() {
    if (!job) {
      setPhase("canceled");
      return;
    }

    const canceledJob = await cancelImportJob(job.id);
    setJob(canceledJob);
    setPhase("canceled");
    await invalidateLibraryQueries();
    onCompleted();
  }

  async function invalidateLibraryQueries() {
    await queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(libraryKeys.all[0])
    });
  }

  return {
    canStartImport,
    cancelImport,
    dragActive,
    error,
    files,
    handleDroppedFiles,
    handleFallbackFilesSelected,
    importFinished,
    importing,
    job,
    omittedFiles,
    phase,
    progress,
    reset,
    selectFolderFromPicker,
    setDragActive,
    startImport,
    summary
  };
}

