"use client";

import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTableHeaderActionButton } from "../../_components/admin-table-header-action-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function LibraryCreateFolderDialog({
  busy,
  folderName,
  folderNotes,
  open,
  onFolderNameChange,
  onFolderNotesChange,
  onOpenChange,
  onSubmit
}: {
  busy: boolean;
  folderName: string;
  folderNotes: string;
  open: boolean;
  onFolderNameChange: (value: string) => void;
  onFolderNotesChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <AdminTableHeaderActionButton icon={FolderPlus} label="Crear" tone="primary" disabled={busy} />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear carpeta</DialogTitle>
          <DialogDescription>Agrega una carpeta dentro de la ubicacion actual de la biblioteca.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-medium text-muted-foreground">Nombre de carpeta</span>
            <Input
              autoFocus
              placeholder="Nueva carpeta"
              value={folderName}
              onChange={(event) => onFolderNameChange(event.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-medium text-muted-foreground">Notas</span>
            <textarea
              className="min-h-24 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              placeholder="Notas internas"
              value={folderNotes}
              onChange={(event) => onFolderNotesChange(event.target.value)}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" size="sm" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={busy || !folderName.trim()}>
              <FolderPlus className="h-4 w-4" />
              Crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
