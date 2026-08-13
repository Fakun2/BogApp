import { z } from "zod";
import type {
  CreateAccountFieldErrors,
  CreateAccountFieldName
} from "../_types/create-account.types";

export function toCreateAccountFieldErrors(error: z.ZodError) {
  return error.issues.reduce<CreateAccountFieldErrors>((accumulator, issue) => {
    const key = issue.path[0] as CreateAccountFieldName | undefined;
    if (key && !accumulator[key]) {
      accumulator[key] = issue.message;
    }

    return accumulator;
  }, {});
}

export function getCreateAccountApiErrorMessage(data: unknown) {
  if (typeof data === "object" && data && "message" in data) {
    const message = (data as { message?: unknown }).message;
    return Array.isArray(message) ? message.join(", ") : String(message);
  }

  return "No se pudo crear la cuenta.";
}
