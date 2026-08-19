import { acceptedLibraryMimeTypes, maxLibraryFileBytes } from "../_constants/library.constants";

export function getLibraryUploadError(file: File) {
  if (!acceptedLibraryMimeTypes.includes(file.type)) {
    return "El archivo debe ser PDF, imagen, Word, Excel o PowerPoint.";
  }
  if (file.size > maxLibraryFileBytes) {
    return "El archivo no puede superar 25 MB.";
  }
  return null;
}
