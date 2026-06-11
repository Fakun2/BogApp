"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authControllerCreateAccount } from "@bogaap/api-client";
import { createAccountFormSchema, type CreateAccountFormValues } from "@/lib/validation/auth";
import { createAccountInitialForm } from "../_constants/create-account.constants";
import {
  getCreateAccountApiErrorMessage,
  toCreateAccountFieldErrors
} from "../_utils/create-account-errors";
import type {
  CreateAccountFieldErrors,
  CreateAccountFieldName,
  UseCreateAccountFormResult
} from "../_types/create-account.types";

export function useCreateAccountForm(): UseCreateAccountFormResult {
  const router = useRouter();
  const [form, setForm] = useState<CreateAccountFormValues>(createAccountInitialForm);
  const [fieldErrors, setFieldErrors] = useState<CreateAccountFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField<K extends CreateAccountFieldName>(
    key: K,
    value: CreateAccountFormValues[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setError(null);
  }

  function togglePasswordVisibility() {
    setShowPassword((current) => !current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const parsed = createAccountFormSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(toCreateAccountFieldErrors(parsed.error));
      setSubmitting(false);
      return;
    }

    try {
      const response = await authControllerCreateAccount({
        ...parsed.data,
        phone: undefined
      });

      if (response.status !== 201) {
        throw new Error(getCreateAccountApiErrorMessage(response.data));
      }

      router.push(`/login?email=${encodeURIComponent(response.data.user.email)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la cuenta.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    fieldErrors,
    error,
    submitting,
    showPassword,
    submit,
    togglePasswordVisibility,
    updateField
  };
}
