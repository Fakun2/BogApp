import type { DocumentMimeGroup } from "./library.types";

export type LibraryFilters = {
  caseId: string;
  categoryId: string;
  mimeGroups: DocumentMimeGroup[];
};

