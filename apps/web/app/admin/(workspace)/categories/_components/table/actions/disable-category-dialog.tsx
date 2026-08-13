"use client";

import { Loader2, PowerOff, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { CategoryDto } from "../../../_types/categories.types";

export function DisableCategoryDialog({
  category,
  error,
  loading,
  onConfirm,
  onOpenChange,
  open
}: {
  category: CategoryDto;
  error?: string;
  loading: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <TriangleAlert className="h-5 w-5" aria-hidden="true" />
          </span>
          <DialogHeader>
            <DialogTitle>Deshabilitar categoria</DialogTitle>
            <DialogDescription>
              {category.name} dejara de estar disponible para nuevas operaciones financieras.
            </DialogDescription>
          </DialogHeader>
        </div>
        {error ? (
          <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-destructive text-white hover:bg-destructive/85"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PowerOff className="h-4 w-4" />}
            Deshabilitar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
