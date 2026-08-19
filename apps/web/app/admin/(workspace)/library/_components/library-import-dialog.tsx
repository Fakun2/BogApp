"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckCircle2, FolderInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AdminTableHeaderActionButton } from "../../_components/admin-table-header-action-button";
import { acceptedLibraryMimeTypes } from "../_constants/library.constants";
import { useLibraryImportController } from "../_hooks/use-library-import-controller";
import { formatBytes } from "../_utils/library-formatters";

export function LibraryImportDialog({
  busy,
  folderId,
  onCompleted
}: {
  busy: boolean;
  folderId: string | null;
  onCompleted: () => void;
}) {
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const importState = useLibraryImportController({ folderId, onCompleted });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen && !importState.importing) {
      importState.reset();
    }
  }

  function handleFallbackFilesSelected(fileList: FileList | null) {
    importState.handleFallbackFilesSelected(fileList);
    if (fallbackInputRef.current) {
      fallbackInputRef.current.value = "";
    }
  }

  async function handleSelectFolder() {
    const handledByPicker = await importState.selectFolderFromPicker();
    if (!handledByPicker) {
      fallbackInputRef.current?.click();
    }
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    await importState.handleDroppedFiles(event.dataTransfer);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <AdminTableHeaderActionButton icon={FolderInput} label="Importar" disabled={busy} />
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-border/40 px-5 pb-4 pt-5">
          <DialogTitle>Importar carpeta</DialogTitle>
          <DialogDescription>
            Selecciona una o mas carpetas locales para preservar su estructura dentro de la ubicacion actual.
          </DialogDescription>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-5 py-5">
          <input
            ref={fallbackInputRef}
            className="hidden"
            type="file"
            multiple
            accept={acceptedLibraryMimeTypes.join(",")}
            onChange={(event) => handleFallbackFilesSelected(event.target.files)}
            {...{ directory: "", webkitdirectory: "" }}
          />

          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3 transition-colors ${
              importState.dragActive
                ? "border-primary bg-primary/10"
                : "border-border/60 bg-muted/30"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              importState.setDragActive(true);
            }}
            onDragLeave={() => importState.setDragActive(false)}
            onDrop={(event) => void handleDrop(event)}
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">
                {importState.summary.rootNames.length ? importState.summary.rootNames.join(", ") : "Carpeta local"}
              </div>
              <div className="text-xs text-muted-foreground">
                {importState.phase === "idle"
                ? "Selecciona una carpeta o arrastra varias carpetas aqui."
                : `${importState.summary.validFiles} archivos listos en ${importState.summary.rootFolders} carpeta${importState.summary.rootFolders === 1 ? "" : "s"}.`}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void handleSelectFolder()}
              disabled={importState.importing}
              className={cn("shrink-0", importState.importing && "pointer-events-none opacity-50")}
            >
              {importState.files.length ? "Agregar carpeta" : "Seleccionar carpeta"}
            </Button>
          </div>

          {importState.phase !== "idle" ? (
            <div className="grid gap-3 sm:grid-cols-4">
              <SummaryTile label="Carpetas" value={importState.summary.folders} />
              <SummaryTile label="Raices" value={importState.summary.rootFolders} />
              <SummaryTile label="Validos" value={importState.summary.validFiles} />
              <SummaryTile label="Omitidos" value={importState.summary.omittedFiles} />
            </div>
          ) : null}

          {importState.phase !== "idle" ? (
            <div className="grid gap-2 rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Seleccionados</div>
              <div>{formatBytes(importState.summary.totalBytes)} en total.</div>
              {importState.summary.rootNames.length ? (
                <div className="max-h-20 overflow-y-auto">
                  {importState.summary.rootNames.map((name) => (
                    <div key={name} className="truncate">
                      {name}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {importState.job ? (
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{importState.job.processedFiles} de {importState.job.totalFiles} procesados</span>
                <span>{importState.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${importState.progress}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">
                {importState.job.completedFiles} importados, {importState.job.skippedFiles} duplicados, {importState.job.rejectedFiles + importState.job.failedFiles} con error.
              </div>
            </div>
          ) : null}

          {importState.phase === "completed" ? (
            <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.9} />
              <div>
                <div className="font-medium">Importacion completada</div>
                <div className="text-xs text-muted-foreground">
                  {importState.job?.completedFiles ?? importState.files.length} archivos importados. La biblioteca ya fue actualizada.
                </div>
              </div>
            </div>
          ) : null}

          {importState.omittedFiles.length ? (
            <div className="rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground">
              <div className="mb-1 font-medium text-foreground">Archivos omitidos</div>
              <div className="max-h-32 overflow-y-auto">
                {importState.omittedFiles.map((item) => (
                  <div key={`${item.name}-${item.reason}`} className="truncate">
                    {item.name}: {item.reason}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {importState.job?.recentItems.length ? (
            <div className="rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground">
              <div className="mb-1 font-medium text-foreground">Ultimos procesados</div>
              <div className="max-h-40 overflow-y-auto">
                {importState.job.recentItems.map((item) => (
                  <div key={item.id} className="truncate">
                    {item.relativePath}: {item.status}
                    {item.error ? ` - ${item.error}` : ""}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {importState.error ? <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">{importState.error}</div> : null}

          <div className="flex justify-end gap-2">
            {importState.importing ? (
              <Button size="sm" variant="outline" onClick={() => void importState.cancelImport()}>
                Cancelar importacion
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => handleOpenChange(false)}>
                Cerrar
              </Button>
            )}
            <Button size="sm" onClick={() => void importState.startImport()} disabled={!importState.canStartImport}>
              Importar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border/60 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
