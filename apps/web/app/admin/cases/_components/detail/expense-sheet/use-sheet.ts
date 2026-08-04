"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { caseExpenseFormSchema, type CaseExpenseFormValues } from "@/lib/validation/cases";
import { casesMutations } from "../../../_api/cases.mutation-controller";
import { useCasesMutation } from "../../../_hooks/use-cases-mutation";
import type { CaseExpenseDto } from "../../../_types/cases.types";
import {
  formatCaseExpenseAmountForInput,
  formatCaseExpenseAmountText,
  parseCaseExpenseAmountText
} from "./amount";
import { emptyCaseExpenseDraft } from "./constants";
import type { CaseExpenseFieldErrors } from "./types";

export function useCaseExpenseSheet({
  caseId,
  defaultDate,
  defaultTaskId,
  expense,
  hideTaskSelect,
  onOpenChange,
  open: controlledOpen
}: {
  caseId: string;
  defaultDate?: string;
  defaultTaskId?: string;
  expense?: CaseExpenseDto;
  hideTaskSelect: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  const [draft, setDraft] = useState<CaseExpenseFormValues>(emptyCaseExpenseDraft);
  const [amountText, setAmountText] = useState("");
  const [errors, setErrors] = useState<CaseExpenseFieldErrors>({});
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const mutation = useCasesMutation(casesMutations.saveExpense({ caseId, expenseId: expense?.id }));
  const router = useRouter();
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(nextOpen: boolean) {
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrors({});
    const nextDraft = expense
      ? mapExpenseToDraft(expense)
        : {
          ...emptyCaseExpenseDraft,
          expenseDate: defaultDate ?? emptyCaseExpenseDraft.expenseDate,
          paymentDate: defaultDate ?? emptyCaseExpenseDraft.paymentDate,
          taskId: defaultTaskId ?? ""
        };

    setDraft(nextDraft);
    setAmountText(nextDraft.amount > 0 ? formatCaseExpenseAmountForInput(nextDraft.amount) : "");
  }, [defaultDate, defaultTaskId, expense, open]);

  function updateDraft<K extends keyof CaseExpenseFormValues>(
    key: K,
    value: CaseExpenseFormValues[K]
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateAmount(value: string) {
    const nextAmountText = formatCaseExpenseAmountText(value);
    setAmountText(nextAmountText);
    updateDraft("amount", parseCaseExpenseAmountText(nextAmountText));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseCaseExpenseAmountText(amountText);
    const values =
      hideTaskSelect && defaultTaskId
        ? { ...draft, amount, taskId: defaultTaskId }
        : { ...draft, amount };
    const parsed = caseExpenseFormSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path[0], issue.message])
        ) as CaseExpenseFieldErrors
      );
      return;
    }

    setErrors({});
    try {
      await mutation.mutateAsync(parsed.data);
      setOpen(false);
      router.refresh();
    } catch {
      // The mutation exposes its error below.
    }
  }

  return {
    amountText,
    draft,
    errors,
    handleSubmit,
    mutation,
    open,
    setOpen,
    updateAmount,
    updateDraft
  };
}

function mapExpenseToDraft(expense: CaseExpenseDto): CaseExpenseFormValues {
  const alertParts = getAlertParts(expense.alertAt);

  return {
    alertDate: alertParts.date,
    alertEnabled: expense.alertEnabled,
    alertTime: alertParts.time,
    amount: expense.amount,
    concept: expense.concept,
    expenseDate: expense.expenseDate,
    notes: expense.notes ?? "",
    paymentDate: expense.paymentDate,
    status: expense.status === "overdue" ? "pending" : expense.status,
    taskId: expense.taskId ?? ""
  };
}

function getAlertParts(alertAt: string | null) {
  if (!alertAt) {
    return { date: "", time: "" };
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: "America/Buenos_Aires",
    year: "numeric"
  }).formatToParts(new Date(alertAt));
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    date: `${partMap.year}-${partMap.month}-${partMap.day}`,
    time: `${partMap.hour}:${partMap.minute}`
  };
}
