"use client";

import { useCallback, useMemo, useState } from "react";

export function useLibrarySelection() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedDocuments), [selectedDocuments]);

  const clearSelection = useCallback(() => {
    setSelectedDocuments([]);
  }, []);

  const toggleDocumentSelection = useCallback((documentId: string, selected: boolean) => {
    setSelectedDocuments((current) =>
      selected ? [...current, documentId] : current.filter((id) => id !== documentId)
    );
  }, []);

  return {
    clearSelection,
    selectedDocuments,
    selectedSet,
    toggleDocumentSelection
  };
}
