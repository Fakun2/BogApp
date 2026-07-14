"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteRoleDialog({
  error,
  loading,
  onConfirm,
  onOpenChange,
  open,
  roleName
}: {
  error?: string;
  loading: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  roleName: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-foreground/35 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/50 bg-card p-6 text-card-foreground shadow-[0_28px_80px_-40px_rgba(15,23,42,0.65)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <TriangleAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                Eliminar rol
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                Se eliminara {roleName}. El personal asociado quedara sin rol asignado.
              </DialogPrimitive.Description>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-11 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/85"
              disabled={loading}
              onClick={onConfirm}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
              Eliminar
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
