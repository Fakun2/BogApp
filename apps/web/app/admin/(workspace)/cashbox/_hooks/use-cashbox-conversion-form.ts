import { useMemo, useState, type FormEvent } from "react";
import type { CurrencyDto } from "../../currencies/_types/currencies.types";
import { useCreateCashboxConversionMutation } from "./use-cashbox-query";
import type { CashboxConversionInput } from "../_types/cashbox.types";
import {
  canonicalDecimalToLocal,
  compareLocalDecimals,
  divideLocalDecimal,
  isPositiveLocalDecimal
} from "../_utils/local-decimal";

export function useCashboxConversionForm({
  currencies,
  selectedBalance,
  selectedCurrencyCode,
  onSuccess
}: {
  currencies: CurrencyDto[];
  selectedBalance: string;
  selectedCurrencyCode?: string;
  onSuccess: () => void;
}) {
  const [fromCurrencyCode, setFromCurrencyCode] = useState(selectedCurrencyCode ?? "");
  const [toCurrencyCode, setToCurrencyCode] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useCreateCashboxConversionMutation();
  const toAmount = useMemo(() => divideLocalDecimal(fromAmount, exchangeRate), [exchangeRate, fromAmount]);
  const localSelectedBalance = canonicalDecimalToLocal(selectedBalance);
  const balanceError =
    fromCurrencyCode === selectedCurrencyCode &&
    fromAmount &&
    compareLocalDecimals(fromAmount, localSelectedBalance, 2) > 0
      ? "El monto origen supera el saldo disponible de la moneda seleccionada."
      : null;

  function prepareCurrencyDefaults() {
    setFromCurrencyCode(selectedCurrencyCode ?? currencies[0]?.code ?? "");
    setToCurrencyCode(currencies.find((currency) => currency.code !== selectedCurrencyCode)?.code ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !fromCurrencyCode ||
      !toCurrencyCode ||
      fromCurrencyCode === toCurrencyCode ||
      !isPositiveLocalDecimal(fromAmount, 2) ||
      !isPositiveLocalDecimal(exchangeRate, 8) ||
      balanceError
    ) {
      return false;
    }

    const input: CashboxConversionInput = {
      description: description.trim() || undefined,
      exchangeRate,
      fromAmount,
      fromCurrencyCode,
      toCurrencyCode
    };

    await mutation.mutateAsync(input);
    reset();
    onSuccess();

    return true;
  }

  function reset() {
    setFromAmount("");
    setExchangeRate("");
    setDescription("");
  }

  return {
    balanceError,
    description,
    exchangeRate,
    fromAmount,
    fromCurrencyCode,
    mutation,
    setDescription,
    setExchangeRate,
    setFromAmount,
    setFromCurrencyCode,
    setToCurrencyCode,
    toAmount,
    toCurrencyCode,
    handleSubmit,
    prepareCurrencyDefaults
  };
}
