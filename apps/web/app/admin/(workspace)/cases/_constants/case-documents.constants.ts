export const acceptedDocumentMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
] as const;

export const acceptedDocumentTypes = acceptedDocumentMimeTypes.join(",");

export const previewableDocumentMimeTypes = new Set<string>([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export const maxCaseDocumentSizeBytes = 25 * 1024 * 1024;
export const maxConcurrentDocumentUploads = 3;
export const documentUploadStartDelayMs = 900;
export const documentUploadMinimumVisibleMs = 3200;
export const documentUploadProgressTickMs = 140;
export const completedDocumentUploadTtlMs = 5000;
export const allCategoriesValue = "__all__";
export const noCategoryValue = "__none__";
