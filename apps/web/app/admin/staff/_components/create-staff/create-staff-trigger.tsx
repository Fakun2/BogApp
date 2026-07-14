import { forwardRef } from "react";
import { Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export const CreateStaffTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={`h-10 w-10 rounded-xl p-0 text-base font-semibold sm:h-11 sm:w-auto sm:px-4 ${className ?? ""}`}
        ref={ref}
        {...props}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Crear</span>
      </Button>
    );
  }
);

CreateStaffTrigger.displayName = "CreateStaffTrigger";
