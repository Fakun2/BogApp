import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export function CreateStaffCloseButton() {
  return (
    <SheetClose asChild>
      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-2xl border-border/50 px-5 text-base font-semibold"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        Cerrar
      </Button>
    </SheetClose>
  );
}
