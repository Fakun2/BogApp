import type { StaffWorker } from "../../_types/staff.types";
import { StateRow } from "./state-row";

export function TableState({
  error,
  loading,
  workers
}: {
  error: Error | null;
  loading: boolean;
  workers: StaffWorker[];
}) {
  if (loading && workers.length === 0) {
    return <StateRow message="Cargando trabajadores..." />;
  }

  if (error) {
    return <StateRow message={error.message} tone="error" />;
  }

  if (workers.length === 0) {
    return <StateRow message="No hay personal para los filtros seleccionados." />;
  }

  return null;
}
