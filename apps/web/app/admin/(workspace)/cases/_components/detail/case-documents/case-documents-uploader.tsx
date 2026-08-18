"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { AttachmentGroup } from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminPrimaryActionButtonClassName } from "../../../../_constants/dashboard";
import { CaseDocumentUploadItem } from "./case-document-upload-item";
import {
  acceptedDocumentTypes,
  noCategoryValue
} from "../../../_constants/case-documents.constants";
import type {
  CaseDocumentsCategoryOption,
  PendingCaseDocumentUpload
} from "../../../_types/case-document-uploads.types";

export function CaseDocumentsUploader({
  categories,
  isLoadingCategories,
  isUploading,
  notes,
  onClearCompleted,
  onFilesSelected,
  onNotesChange,
  onRemoveUpload,
  onRetryUpload,
  onSelectedCategoryChange,
  selectedCategoryId,
  uploads
}: {
  categories: CaseDocumentsCategoryOption[];
  isLoadingCategories: boolean;
  isUploading: boolean;
  notes: string;
  onClearCompleted: () => void;
  onFilesSelected: (files: FileList) => Promise<void>;
  onNotesChange: (value: string) => void;
  onRemoveUpload: (uploadId: string) => void;
  onRetryUpload: (uploadId: string) => void;
  onSelectedCategoryChange: (value: string) => void;
  selectedCategoryId: string;
  uploads: PendingCaseDocumentUpload[];
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasCompletedUploads = uploads.some((upload) => upload.status === "done");

  async function handleFileChange(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    await onFilesSelected(fileList);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border-b border-border/30 py-4">
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_190px]">
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept={acceptedDocumentTypes}
          multiple
          onChange={(event) => void handleFileChange(event.target.files)}
        />
        <Select
          value={selectedCategoryId}
          onValueChange={onSelectedCategoryChange}
          disabled={isLoadingCategories}
        >
          <SelectTrigger className="h-10 w-full border-border/50">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={noCategoryValue}>Sin categoria</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          className="min-h-10 resize-none border-border/50 text-sm"
          maxLength={500}
          placeholder="Notas para los archivos seleccionados"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
        <Button
          type="button"
          className={`h-10 justify-center gap-2 ${adminPrimaryActionButtonClassName}`}
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          <span>Subir archivos</span>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {uploads.length > 0 ? (
          <motion.div
            className="mt-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                Cola de subida ({uploads.length})
              </span>
              {hasCompletedUploads ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="gap-1.5"
                  onClick={onClearCompleted}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Limpiar subidos
                </Button>
              ) : null}
            </div>
            <AttachmentGroup className="gap-2">
              <AnimatePresence initial={false}>
                {uploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    layout
                    className="flex-none snap-start"
                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <CaseDocumentUploadItem
                      upload={upload}
                      onRemove={onRemoveUpload}
                      onRetry={onRetryUpload}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </AttachmentGroup>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
