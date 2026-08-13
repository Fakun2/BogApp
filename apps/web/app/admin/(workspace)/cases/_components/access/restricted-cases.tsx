import { UnauthorizedState } from "@/components/ui/not-found";

export function RestrictedCases() {
  return (
    <UnauthorizedState
      title="Expedientes restringidos"
      description="Necesitas permisos adicionales para acceder al area de expedientes."
    />
  );
}
