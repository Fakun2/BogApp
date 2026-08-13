export function formatLocalDecimalInput(value: string, decimalScale: number) {
  const sanitized = keepDigitsAndFirstComma(value);
  const [rawInteger = "", rawDecimal = ""] = sanitized.split(",");
  const hasComma = sanitized.includes(",");
  const integerDigits = rawInteger.replace(/^0+(?=\d)/, "");
  const groupedInteger = groupThousands(integerDigits || (hasComma ? "0" : ""));
  const decimalDigits = rawDecimal.slice(0, decimalScale);

  if (!groupedInteger && !hasComma) {
    return "";
  }

  return hasComma ? `${groupedInteger},${decimalDigits}` : groupedInteger;
}

export function compareLocalDecimals(left: string, right: string, scale = 2) {
  const leftMinor = localDecimalToMinor(left, scale);
  const rightMinor = localDecimalToMinor(right, scale);

  if (leftMinor === rightMinor) {
    return 0;
  }

  return leftMinor > rightMinor ? 1 : -1;
}

export function isLocalDecimalGreaterThanCanonical(leftLocal: string, rightCanonical: string, scale = 2) {
  return localDecimalToSignedMinor(leftLocal, scale) > canonicalDecimalToSignedMinor(rightCanonical, scale);
}

export function isPositiveLocalDecimal(value: string, scale = 2) {
  return value.trim() !== "" && !value.endsWith(",") && compareLocalDecimals(value, "0", scale) > 0;
}

export function subtractLocalFromCanonicalDecimal(canonicalValue: string, localValue: string, scale = 2) {
  return minorToLocalDecimal(
    canonicalDecimalToSignedMinor(canonicalValue, scale) - localDecimalToSignedMinor(localValue, scale),
    scale
  );
}

export function divideLocalDecimal(dividend: string, divisor: string) {
  const dividendMinor = localDecimalToMinor(dividend, 2);
  const divisorScaled = localDecimalToMinor(divisor, 8);

  if (dividendMinor <= 0n || divisorScaled <= 0n) {
    return "0,00";
  }

  const scaledDividend = dividendMinor * 100000000n;
  const quotient = scaledDividend / divisorScaled;
  const remainder = scaledDividend % divisorScaled;
  const rounded = remainder * 2n >= divisorScaled ? quotient + 1n : quotient;

  return minorToLocalDecimal(rounded, 2);
}

export function canonicalDecimalToLocal(value: string) {
  const [integerPart = "0", decimalPart = ""] = value.split(".");
  const groupedInteger = groupThousands(integerPart.replace(/^0+(?=\d)/, "") || "0");

  return decimalPart ? `${groupedInteger},${decimalPart}` : groupedInteger;
}

export function formatCanonicalMoney(value: string | undefined, symbol = "") {
  const localValue = canonicalDecimalToLocal(value ?? "0.00");
  const [integerPart, decimalPart = ""] = localValue.split(",");
  const fixedDecimals = decimalPart.slice(0, 2).padEnd(2, "0");

  return `${symbol} ${integerPart},${fixedDecimals}`;
}

export function localDecimalToMinor(value: string, scale: number) {
  const normalized = value.replace(/\./g, "");
  const [integerPart = "0", decimalPart = ""] = normalized.split(",");
  const safeInteger = integerPart.replace(/\D/g, "") || "0";
  const safeDecimal = decimalPart.replace(/\D/g, "").slice(0, scale).padEnd(scale, "0");

  return BigInt(`${safeInteger}${safeDecimal}`);
}

function canonicalDecimalToSignedMinor(value: string, scale: number) {
  const trimmed = value.trim();
  const sign = trimmed.startsWith("-") ? -1n : 1n;
  const [integerPart = "0", decimalPart = ""] = trimmed.replace(/^-/, "").split(".");
  const safeInteger = integerPart.replace(/\D/g, "") || "0";
  const safeDecimal = decimalPart.replace(/\D/g, "").slice(0, scale).padEnd(scale, "0");

  return sign * BigInt(`${safeInteger}${safeDecimal}`);
}

function localDecimalToSignedMinor(value: string, scale: number) {
  const trimmed = value.trim();
  const sign = trimmed.startsWith("-") ? -1n : 1n;

  return sign * localDecimalToMinor(trimmed.replace(/^-/, ""), scale);
}

function minorToLocalDecimal(value: bigint, scale: number) {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  const padded = absolute.toString().padStart(scale + 1, "0");
  const integerPart = padded.slice(0, -scale);
  const decimalPart = padded.slice(-scale);

  return `${sign}${groupThousands(integerPart)},${decimalPart}`;
}

function keepDigitsAndFirstComma(value: string) {
  let hasComma = false;
  let result = "";

  for (const char of value) {
    if (/\d/.test(char)) {
      result += char;
      continue;
    }

    if (char === "," && !hasComma) {
      result += char;
      hasComma = true;
    }
  }

  return result;
}

function groupThousands(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
