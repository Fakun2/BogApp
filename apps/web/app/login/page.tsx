"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, Loader2, Scale } from "lucide-react";
import { authControllerLogin } from "@bogaap/api-client";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth/session";
import { loginFormSchema, type LoginFormValues } from "@/lib/validation/auth";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const initialForm: LoginFormValues = {
  email: "",
  password: ""
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormValues>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) {
      setForm((current) => ({ ...current, email }));
    }
  }, []);

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

    const parsed = loginFormSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setSubmitting(false);
      return;
    }

    try {
      const response = await authControllerLogin(parsed.data);

      if (response.status !== 200) {
        throw new Error(getApiErrorMessage(response.data));
      }

      saveSession(response.data);
      router.push("/onboarding");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="max-w-xl">
          <Badge variant="secondary" className="gap-2">
            <Scale className="h-4 w-4" />
            BOGAP
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
            Iniciar sesión
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Entrá con tu cuenta global para continuar con el onboarding del estudio o acceder a tus
            tenants activos.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            El acceso a cada estudio se resuelve por membership y RBAC.
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={submit}>
              <Field label="Email laboral" error={fieldErrors.email}>
                <Input
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.currentTarget.value)}
                />
              </Field>

              <Field label="Contraseña" error={fieldErrors.password}>
                <Input
                  autoComplete="current-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.currentTarget.value)}
                />
              </Field>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Entrar
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Todavía no tenés cuenta?{" "}
                <Link className="font-medium text-primary" href="/create-account">
                  Crear cuenta
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
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

  return "No se pudo iniciar sesión.";
}
