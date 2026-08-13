import type { StaffWorker } from "../../../_types/staff.types";
import { StateRow } from "./state-row";

export function TableState({
  columnCount,
  error,
  loading,
  workers
}: {
  columnCount: number;
  error: Error | null;
  loading: boolean;
  workers: StaffWorker[];
}) {
  if (loading && workers.length === 0) {
    return <StateRow columnCount={columnCount} message="Cargando trabajadores..." />;
  }

  if (error) {
    return <StateRow columnCount={columnCount} message={error.message} tone="error" />;
  }

  if (workers.length === 0) {
    return (
      <StateRow
        columnCount={columnCount}
        message="No hay personal para los filtros seleccionados."
      />
    );
  }

  return null;
}
