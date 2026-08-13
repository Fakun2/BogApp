import type { CashboxColumn, CashboxMovementType } from "../_types/cashbox.types";

export const cashboxMovementsPageSize = 12;

export const cashboxDefaultColumns: CashboxColumn[] = [
  "occurredAt",
  "type",
  "amount",
  "category",
  "description",
  "user",
  "actions"
];

export const cashboxColumnLabels: Record<CashboxColumn, string> = {
  actions: "Acciones",
  amount: "Monto",
  category: "Categoria",
  description: "Descripcion",
  occurredAt: "Fecha",
  type: "Tipo",
  user: "Usuario"
};

export const cashboxMovementTypeLabels: Record<CashboxMovementType, string> = {
  conversion_in: "Conversion entrada",
  conversion_out: "Conversion salida",
  expense: "Egreso",
  income: "Ingreso"
};

export const cashboxMovementSignMap: Record<CashboxMovementType, 1 | -1> = {
  conversion_in: 1,
  conversion_out: -1,
  expense: -1,
  income: 1
};
