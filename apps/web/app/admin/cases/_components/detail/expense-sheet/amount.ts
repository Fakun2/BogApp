export function formatCaseExpenseAmountText(value: string) {
  const sanitized = value.replace(/\./g, "").replace(/[^\d,]/g, "");
  const hasDecimalSeparator = sanitized.includes(",");
  const [rawInteger = "", ...decimalParts] = sanitized.split(",");
  const integer = rawInteger.replace(/^0+(?=\d)/, "");
  const decimals = decimalParts.join("").slice(0, 2);
  const formattedInteger = integer ? Number(integer).toLocaleString("es-AR") : "";

  if (hasDecimalSeparator) {
    return `${formattedInteger || "0"},${decimals}`;
  }

  return formattedInteger;
}

export function formatCaseExpenseAmountForInput(value: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value);
}

export function parseCaseExpenseAmountText(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : 0;
}
