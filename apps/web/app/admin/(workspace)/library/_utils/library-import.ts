import type {
  FileSystemDirectoryHandleLike,
  LibraryImportFile,
  LibraryImportSummary,
  OmittedLibraryImportFile
} from "../_types/library-import.types";
import { getLibraryUploadError } from "./library-upload-validation";

export function prepareImportFiles(
  rawFiles: File[],
  currentFiles: LibraryImportFile[] = [],
  currentOmittedFiles: OmittedLibraryImportFile[] = []
) {
  const files: LibraryImportFile[] = [...currentFiles];
  const omittedFiles: OmittedLibraryImportFile[] = [...currentOmittedFiles];
  const seenFiles = new Set(files.map((item) => getImportFileKey(item)));
  const seenOmitted = new Set(omittedFiles.map((item) => `${item.name}:${item.reason}`));

  for (const file of rawFiles) {
    const relativePath = getFileRelativePath(file);
    const fileKey = getImportFileKey({ file, relativePath });
    if (seenFiles.has(fileKey)) {
      continue;
    }

    const error = getLibraryUploadError(file);
    if (error) {
      const omittedKey = `${relativePath}:${error}`;
      if (!seenOmitted.has(omittedKey)) {
        omittedFiles.push({ name: relativePath, reason: error });
        seenOmitted.add(omittedKey);
      }
      continue;
    }

    files.push({ file, relativePath });
    seenFiles.add(fileKey);
  }

  return { files, omittedFiles };
}

export function getImportSummary(
  files: LibraryImportFile[],
  omittedFiles: OmittedLibraryImportFile[]
): LibraryImportSummary {
  const folderPaths = new Set<string>();
  const rootNames = new Set<string>();
  let totalBytes = 0;

  for (const item of files) {
    totalBytes += item.file.size;
    const segments = item.relativePath.split("/").filter(Boolean);
    if (segments[0]) {
      rootNames.add(segments[0]);
    }
    for (let index = 1; index < segments.length; index += 1) {
      folderPaths.add(segments.slice(0, index).join("/"));
    }
  }

  return {
    folders: folderPaths.size,
    omittedFiles: omittedFiles.length,
    rootFolders: rootNames.size,
    rootNames: [...rootNames].sort((left, right) => left.localeCompare(right)),
    totalBytes,
    validFiles: files.length
  };
}

export async function getDroppedImportFiles(dataTransfer: DataTransfer) {
  const entries = Array.from(dataTransfer.items)
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));

  if (!entries.length) {
    return Array.from(dataTransfer.files);
  }

  const files = await Promise.all(entries.map((entry) => readEntryFiles(entry, "")));
  return files.flat();
}

export async function readDirectoryHandleFiles(
  directory: FileSystemDirectoryHandleLike,
  parentPath: string
): Promise<File[]> {
  const files: File[] = [];

  for await (const [, handle] of directory.entries()) {
    const nextPath = `${parentPath}/${handle.name}`;
    if (handle.kind === "file") {
      const file = await handle.getFile();
      defineRelativePath(file, nextPath);
      files.push(file);
      continue;
    }

    files.push(...(await readDirectoryHandleFiles(handle, nextPath)));
  }

  return files;
}

function getFileRelativePath(file: File) {
  const fileWithPath = file as File & { relativePath?: string; webkitRelativePath?: string };
  return fileWithPath.relativePath || fileWithPath.webkitRelativePath || file.name;
}

function getImportFileKey(item: LibraryImportFile) {
  return `${item.relativePath}:${item.file.size}:${item.file.lastModified}`;
}

async function readEntryFiles(entry: FileSystemEntry, parentPath: string): Promise<File[]> {
  const nextPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
  if (entry.isFile) {
    const file = await readFileEntry(entry as FileSystemFileEntry);
    defineRelativePath(file, nextPath);
    return [file];
  }

  if (!entry.isDirectory) {
    return [];
  }

  const children = await readDirectoryEntries(entry as FileSystemDirectoryEntry);
  const files = await Promise.all(children.map((child) => readEntryFiles(child, nextPath)));
  return files.flat();
}

function readFileEntry(entry: FileSystemFileEntry) {
  return new Promise<File>((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

async function readDirectoryEntries(entry: FileSystemDirectoryEntry) {
  const reader = entry.createReader();
  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    if (!batch.length) {
      break;
    }
    entries.push(...batch);
  }

  return entries;
}

function defineRelativePath(file: File, relativePath: string) {
  Object.defineProperty(file, "relativePath", {
    configurable: true,
    value: relativePath
  });
}

