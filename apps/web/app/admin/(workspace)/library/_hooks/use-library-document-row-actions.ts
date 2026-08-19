"use client";

import { useState } from "react";
import { getDocumentDownloadUrl, getDocumentPreviewUrl } from "../_api/library.api";
import type { LibraryDocumentDto } from "../_types/library.types";

export function useLibraryDocumentRowActions({
  document,
  onDelete,
  onRename
}: {
  document: LibraryDocumentDto;
  onDelete: (documentId: string) => void;
  onRename: (document: LibraryDocumentDto, title: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [title, setTitle] = useState(document.title);

  function preview() {
    window.open(getDocumentPreviewUrl(document.id), "_blank", "noreferrer");
  }

  function download() {
    window.location.assign(getDocumentDownloadUrl(document.id));
  }

  function openRename() {
    setTitle(document.title);
    setRenameOpen(true);
  }

  function submitRename() {
    onRename(document, title);
    setRenameOpen(false);
  }

  function confirmDelete() {
    onDelete(document.id);
    setDeleteOpen(false);
  }

  return {
    confirmDelete,
    deleteOpen,
    download,
    openRename,
    preview,
    renameOpen,
    setDeleteOpen,
    setRenameOpen,
    setTitle,
    submitRename,
    title
  };
}

