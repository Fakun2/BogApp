"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { caseExpenseFormSchema, type CaseExpenseFormValues } from "@/lib/validation/cases";
import { useSaveCaseExpenseMutation } from "../../../_hooks/use-save-case-expense-mutation";
import type { CaseExpenseDto } from "../../../_types/cases.types";
import {
  formatCaseExpenseAmountForInput,
  formatCaseExpenseAmountText,
  parseCaseExpenseAmountText
} from "./case-expense-amount";
import { emptyCaseExpenseDraft } from "./case-expense-sheet.constants";
import type { CaseExpenseFieldErrors } from "./case-expense-sheet.types";

export function useCaseExpenseSheet({
  caseId,
  defaultTaskId,
  expense,
  hideTaskSelect,
  onOpenChange,
  open: controlledOpen
}: {
  caseId: string;
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
  const mutation = useSaveCaseExpenseMutation({ caseId, expenseId: expense?.id });
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
          taskId: defaultTaskId ?? ""
        };

    setDraft(nextDraft);
    setAmountText(nextDraft.amount > 0 ? formatCaseExpenseAmountForInput(nextDraft.amount) : "");
  }, [defaultTaskId, expense, open]);

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
