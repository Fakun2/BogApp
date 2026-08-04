import { forwardRef } from "react";
import { Plus } from "lucide-react";
import type { ButtonProps } from "@/components/ui/button";
import { AdminTableHeaderActionButton } from "../../../_components/admin-table-header-action-button";

export const CreateStaffTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <AdminTableHeaderActionButton
        icon={Plus}
        label="Crear"
        tone="primary"
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);

CreateStaffTrigger.displayName = "CreateStaffTrigger";
