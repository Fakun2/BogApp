import { Loader2, PencilLine, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";

export function CreateStaffSubmitButton({
  disabled = false,
  mode = "create"
}: {
  disabled?: boolean;
  mode?: "create" | "update";
}) {
  const Icon = mode === "create" ? UserPlus : PencilLine;
  const label = mode === "create" ? "Crear empleado" : "Actualizar empleado";

  return (
    <Button
      disabled={disabled}
      type="submit"
      className={`h-12 w-full text-base font-semibold shadow-[0_16px_26px_-20px_rgba(37,99,235,0.65)] ${adminPrimaryActionButtonClassName}`}
    >
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
