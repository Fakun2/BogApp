"use client";

import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CashboxDialogActions({
  loading,
  onCancel
}: {
  loading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button" variant="outline" disabled={loading} onClick={onCancel}>
        <X className="h-4 w-4" />
        Cancelar
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Guardar
      </Button>
    </div>
  );
}
