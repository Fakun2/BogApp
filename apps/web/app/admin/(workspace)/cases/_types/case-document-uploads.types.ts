import type { CaseDocumentDto, DocumentCategoryDto } from "./cases.types";

export type CaseDocumentUploadStatus = "idle" | "uploading" | "done" | "error";

export type PendingCaseDocumentUpload = {
  categoryId?: string;
  completedAt?: number;
  errorMessage?: string;
  file: File;
  id: string;
  mimeType: string;
  notes?: string;
  originalName: string;
  previewUrl?: string;
  progress: number;
  sizeBytes: number;
  status: CaseDocumentUploadStatus;
  uploadedDocument?: CaseDocumentDto;
};

export type CaseDocumentsPanelProps = {
  canRead: boolean;
  canWrite: boolean;
  caseId: string;
};

export type CaseDocumentsCategoryOption = Pick<DocumentCategoryDto, "id" | "name">;
