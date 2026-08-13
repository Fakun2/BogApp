import { useState, type FormEvent } from "react";
import { useCategoriesQuery } from "../../categories/_hooks/use-categories-query";
import { useCreateCashboxMovementMutation } from "./use-cashbox-query";
import type { CashboxMovementInput } from "../_types/cashbox.types";
import { filterCategoriesForMovement } from "../_utils/cashbox-categories";
import {
  formatCanonicalMoney,
  isLocalDecimalGreaterThanCanonical,
  isPositiveLocalDecimal,
  subtractLocalFromCanonicalDecimal
} from "../_utils/local-decimal";

export function useCashboxMovementForm({
  currentBalance = "0.00",
  currentBalanceSymbol,
  currencyCode,
  mode,
  onSuccess
}: {
  currentBalance?: string;
  currentBalanceSymbol?: string;
  currencyCode?: string;
  mode: "income" | "expense";
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryValue, setCategoryValue] = useState("none");
  const mutation = useCreateCashboxMovementMutation();
  const categoriesQuery = useCategoriesQuery({
    cursor: null,
    kind: "all",
    limit: 50,
    origin: "all",
    search: "",
    sort: "name:asc",
    status: "active"
  });
  const categories = filterCategoriesForMovement(categoriesQuery.data?.items ?? [], mode);
  const negativeBalanceWarning = getNegativeBalanceWarning({
    amount,
    currentBalance,
    currentBalanceSymbol,
    mode
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currencyCode || !isPositiveLocalDecimal(amount, 2)) {
      return false;
    }

    const input: CashboxMovementInput = {
      amount,
      currencyCode,
      description: description.trim() || undefined,
      type: mode
    };

    if (categoryValue !== "none") {
      const [origin, id] = categoryValue.split(":") as ["global" | "tenant", string];
      input.category = { id, origin };
    }

    await mutation.mutateAsync(input);
    reset();
    onSuccess();

    return true;
  }

  function reset() {
    setAmount("");
    setDescription("");
    setCategoryValue("none");
  }

  return {
    amount,
    categories,
    categoryValue,
    description,
    mutation,
    negativeBalanceWarning,
    setAmount,
    setCategoryValue,
    setDescription,
    handleSubmit
  };
}

function getNegativeBalanceWarning({
  amount,
  currentBalance,
  currentBalanceSymbol,
  mode
}: {
  amount: string;
  currentBalance: string;
  currentBalanceSymbol?: string;
  mode: "income" | "expense";
}) {
  const willCreateNegativeBalance =
    mode === "expense" &&
    isPositiveLocalDecimal(amount, 2) &&
    (currentBalance.trim().startsWith("-") ||
      isLocalDecimalGreaterThanCanonical(amount, currentBalance, 2));

  if (!willCreateNegativeBalance) {
    return null;
  }

  return {
    currentBalance: formatCanonicalMoney(currentBalance, currentBalanceSymbol),
    projectedBalance: `${currentBalanceSymbol ?? ""} ${subtractLocalFromCanonicalDecimal(currentBalance, amount, 2)}`.trim()
  };
}
