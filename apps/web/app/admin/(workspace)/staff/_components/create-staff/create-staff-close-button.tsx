import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export function CreateStaffCloseButton() {
  return (
    <SheetClose asChild>
      <Button
        type="button"
        variant="outline"
        className="h-12 border-border/50 px-3 text-base font-semibold sm:px-5"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Cerrar</span>
      </Button>
    </SheetClose>
  );
}
