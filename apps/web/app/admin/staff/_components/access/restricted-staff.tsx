import { UnauthorizedState } from "@/components/ui/not-found";

export function RestrictedStaff() {
  return (
    <UnauthorizedState
      title="Staff restringido"
      description="Necesitas permisos adicionales para acceder al area de staff."
    />
  );
}
