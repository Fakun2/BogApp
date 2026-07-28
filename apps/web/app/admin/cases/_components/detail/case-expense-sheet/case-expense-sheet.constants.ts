import type { CaseExpenseFormValues } from "@/lib/validation/cases";
import { mapRecordToOptions } from "../../../_utils/case-options";

export const caseExpenseStatusOptions = mapRecordToOptions({
  cancelled: "Cancelado",
  paid: "Pagado",
  pending: "Pendiente"
});
export const noCaseExpenseTaskValue = "none";

export const emptyCaseExpenseDraft: CaseExpenseFormValues = {
  alertDate: "",
  alertEnabled: false,
  alertTime: "",
  amount: 0,
  concept: "",
  expenseDate: "",
  notes: "",
  paymentDate: "",
  status: "pending",
  taskId: ""
};
