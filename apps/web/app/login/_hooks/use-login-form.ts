"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authControllerLogin } from "@bogaap/api-client";
import { z } from "zod";
import { hasTenantAccess, saveSession } from "@/lib/auth/session";
import { loginFormSchema, type LoginFormValues } from "@/lib/validation/auth";
import {
  loginLoadingExitMs,
  loginLoadingSuccessMs,
  loginLoadingTotalMs
} from "../_constants/login.constants";
import { useLoginTransition } from "./use-login-transition";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const initialForm: LoginFormValues = {
  email: "",
  password: ""
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function useLoginForm(initialEmail: string | null) {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormValues>(() => ({
    ...initialForm,
    email: initialEmail ?? ""
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const transition = useLoginTransition();

  useEffect(() => {
    if (initialEmail) {
      setForm((current) => ({ ...current, email: initialEmail }));
    }
  }, [initialEmail]);

  function updateField<K extends keyof LoginFormValues>(key: K, value: LoginFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    transition.start();

    const parsed = loginFormSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      transition.reset();
      setSubmitting(false);
      return;
    }

    let shouldHideTransition = true;
    const transitionStartedAt = Date.now();

    try {
      const response = await authControllerLogin(parsed.data);

      if (response.status !== 200) {
        throw new Error(getApiErrorMessage(response.data));
      }

      saveSession(response.data);
      const elapsed = Date.now() - transitionStartedAt;
      await wait(Math.max(loginLoadingTotalMs - elapsed, 0));
      transition.showSuccess();
      await wait(loginLoadingSuccessMs);
      transition.exit();
      await wait(loginLoadingExitMs);
      shouldHideTransition = false;
      router.push(hasTenantAccess(response.data) ? "/admin" : "/onboarding");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesion.");
    } finally {
      if (shouldHideTransition) {
        transition.reset();
        setSubmitting(false);
      }
    }
  }

  return {
    error,
    fieldErrors,
    form,
    submit,
    submitting,
    transitionExiting: transition.exiting,
    transitionSuccess: transition.success,
    updateField
  };
}

function toFieldErrors(error: z.ZodError<LoginFormValues>) {
  return error.issues.reduce<FieldErrors>((accumulator, issue) => {
    const key = issue.path[0] as keyof LoginFormValues | undefined;
    if (key && !accumulator[key]) {
      accumulator[key] = issue.message;
    }

    return accumulator;
  }, {});
}

function getApiErrorMessage(data: unknown) {
  if (typeof data === "object" && data && "message" in data) {
    const message = (data as { message?: unknown }).message;
    return Array.isArray(message) ? message.join(", ") : String(message);
  }

  return "No se pudo iniciar sesion.";
}
