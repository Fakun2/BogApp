import { UnauthorizedState } from "@/components/ui/not-found";

export function RestrictedCashbox() {
  return (
    <UnauthorizedState
      title="Caja restringida"
      description="Necesitas permisos adicionales para acceder a la caja del estudio."
    />
  );
}
