export type LibraryImportPhase =
  | "idle"
  | "prepared"
  | "uploading"
  | "completed"
  | "failed"
  | "canceled";

export type LibraryImportFile = {
  file: File;
  relativePath: string;
};

export type OmittedLibraryImportFile = {
  name: string;
  reason: string;
};

export type LibraryImportSummary = {
  folders: number;
  omittedFiles: number;
  rootFolders: number;
  rootNames: string[];
  totalBytes: number;
  validFiles: number;
};

export type FileSystemFileHandleLike = {
  kind: "file";
  name: string;
  getFile: () => Promise<File>;
};

export type FileSystemDirectoryHandleLike = {
  kind: "directory";
  name: string;
  entries: () => AsyncIterableIterator<[string, FileSystemFileHandleLike | FileSystemDirectoryHandleLike]>;
};

export type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandleLike>;
};

