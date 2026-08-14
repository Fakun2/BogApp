import { useMemo, useState, type FormEvent } from "react";
import type { CurrencyDto } from "../../currencies/_types/currencies.types";
import { useCreateCashboxConversionMutation } from "./use-cashbox-query";
import type { CashboxConversionInput } from "../_types/cashbox.types";
import {
  canonicalDecimalToLocal,
  compareLocalDecimals,
  convertLocalDecimalWithQuote,
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
  const [quoteBaseCurrencyCode, setQuoteBaseCurrencyCode] = useState("");
  const [quoteCounterCurrencyCode, setQuoteCounterCurrencyCode] = useState("");
  const [quoteRate, setQuoteRate] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useCreateCashboxConversionMutation();
  const toAmount = useMemo(
    () =>
      convertLocalDecimalWithQuote({
        fromAmount,
        fromCurrencyCode,
        quoteBaseCurrencyCode,
        quoteCounterCurrencyCode,
        quoteRate,
        toCurrencyCode
      }),
    [fromAmount, fromCurrencyCode, quoteBaseCurrencyCode, quoteCounterCurrencyCode, quoteRate, toCurrencyCode]
  );
  const localSelectedBalance = canonicalDecimalToLocal(selectedBalance);
  const balanceError =
    fromCurrencyCode === selectedCurrencyCode &&
    fromAmount &&
    compareLocalDecimals(fromAmount, localSelectedBalance, 2) > 0
      ? "El monto origen supera el saldo disponible de la moneda seleccionada."
      : null;

  function setQuoteDefaults(nextFromCurrencyCode: string, nextToCurrencyCode: string) {
    setQuotePair({
      fromCurrencyCode: nextFromCurrencyCode,
      setQuoteBaseCurrencyCode,
      setQuoteCounterCurrencyCode,
      toCurrencyCode: nextToCurrencyCode
    });
  }

  function prepareCurrencyDefaults() {
    const nextFromCurrencyCode = selectedCurrencyCode ?? currencies[0]?.code ?? "";
    const nextToCurrencyCode = currencies.find((currency) => currency.code !== nextFromCurrencyCode)?.code ?? "";

    setFromCurrencyCode(nextFromCurrencyCode);
    setToCurrencyCode(nextToCurrencyCode);
    setQuoteDefaults(nextFromCurrencyCode, nextToCurrencyCode);
  }

  function handleFromCurrencyCodeChange(nextFromCurrencyCode: string) {
    const nextToCurrencyCode = nextFromCurrencyCode === toCurrencyCode ? "" : toCurrencyCode;

    setFromCurrencyCode(nextFromCurrencyCode);
    setToCurrencyCode(nextToCurrencyCode);
    setQuoteDefaults(nextFromCurrencyCode, nextToCurrencyCode);
  }

  function handleToCurrencyCodeChange(nextToCurrencyCode: string) {
    const nextFromCurrencyCode = nextToCurrencyCode === fromCurrencyCode ? "" : fromCurrencyCode;

    setFromCurrencyCode(nextFromCurrencyCode);
    setToCurrencyCode(nextToCurrencyCode);
    setQuoteDefaults(nextFromCurrencyCode, nextToCurrencyCode);
  }

  function handleQuoteBaseCurrencyCodeChange(nextQuoteBaseCurrencyCode: string) {
    setQuoteBaseCurrencyCode(nextQuoteBaseCurrencyCode);

    if (nextQuoteBaseCurrencyCode === quoteCounterCurrencyCode) {
      setQuoteCounterCurrencyCode("");
    }
  }

  function handleQuoteCounterCurrencyCodeChange(nextQuoteCounterCurrencyCode: string) {
    if (nextQuoteCounterCurrencyCode === quoteBaseCurrencyCode) {
      setQuoteBaseCurrencyCode("");
    }

    setQuoteCounterCurrencyCode(nextQuoteCounterCurrencyCode);
  }

  function invertQuote() {
    setQuoteBaseCurrencyCode(quoteCounterCurrencyCode);
    setQuoteCounterCurrencyCode(quoteBaseCurrencyCode);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !fromCurrencyCode ||
      !toCurrencyCode ||
      fromCurrencyCode === toCurrencyCode ||
      !isPositiveLocalDecimal(fromAmount, 2) ||
      !quoteBaseCurrencyCode ||
      !quoteCounterCurrencyCode ||
      quoteBaseCurrencyCode === quoteCounterCurrencyCode ||
      !isPositiveLocalDecimal(quoteRate, 8) ||
      balanceError
    ) {
      return false;
    }

    const input: CashboxConversionInput = {
      description: description.trim() || undefined,
      fromAmount,
      fromCurrencyCode,
      quoteBaseCurrencyCode,
      quoteCounterCurrencyCode,
      quoteRate,
      toCurrencyCode
    };

    await mutation.mutateAsync(input);
    reset();
    onSuccess();

    return true;
  }

  function reset() {
    setFromAmount("");
    setQuoteRate("");
    setDescription("");
  }

  return {
    balanceError,
    description,
    fromAmount,
    fromCurrencyCode,
    invertQuote,
    mutation,
    quoteBaseCurrencyCode,
    quoteCounterCurrencyCode,
    quoteRate,
    setDescription,
    setFromAmount,
    setFromCurrencyCode: handleFromCurrencyCodeChange,
    setQuoteBaseCurrencyCode: handleQuoteBaseCurrencyCodeChange,
    setQuoteCounterCurrencyCode: handleQuoteCounterCurrencyCodeChange,
    setQuoteRate,
    setToCurrencyCode: handleToCurrencyCodeChange,
    toAmount,
    toCurrencyCode,
    handleSubmit,
    prepareCurrencyDefaults
  };
}

function getPreferredQuoteBaseCurrencyCode(fromCurrencyCode: string, toCurrencyCode: string) {
  if (fromCurrencyCode === "ARS") {
    return toCurrencyCode;
  }

  if (toCurrencyCode === "ARS") {
    return fromCurrencyCode;
  }

  return fromCurrencyCode;
}

function getCounterCurrencyCode(baseCurrencyCode: string, fromCurrencyCode: string, toCurrencyCode: string) {
  return baseCurrencyCode === fromCurrencyCode ? toCurrencyCode : fromCurrencyCode;
}

function setQuotePair({
  fromCurrencyCode,
  setQuoteBaseCurrencyCode,
  setQuoteCounterCurrencyCode,
  toCurrencyCode
}: {
  fromCurrencyCode: string;
  setQuoteBaseCurrencyCode: (value: string) => void;
  setQuoteCounterCurrencyCode: (value: string) => void;
  toCurrencyCode: string;
}) {
  if (!fromCurrencyCode || !toCurrencyCode || fromCurrencyCode === toCurrencyCode) {
    setQuoteBaseCurrencyCode("");
    setQuoteCounterCurrencyCode("");
    return;
  }

  const baseCurrencyCode = getPreferredQuoteBaseCurrencyCode(fromCurrencyCode, toCurrencyCode);
  setQuoteBaseCurrencyCode(baseCurrencyCode);
  setQuoteCounterCurrencyCode(getCounterCurrencyCode(baseCurrencyCode, fromCurrencyCode, toCurrencyCode));
}
