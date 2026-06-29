"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, Loader2, Scale, ShieldCheck, Users } from "lucide-react";
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
        <div className="rounded-[2rem] border border-border bg-card/70 p-8 shadow-sm lg:p-10">
          <Badge variant="secondary" className="gap-2 rounded-full px-4 py-2">
            <Scale className="h-4 w-4 text-primary" />
            BogApp LegalTech
          </Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
            Acceso privado al estudio
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Inicia sesion para continuar con la gestion de clientes, expedientes, tareas y
            permisos del workspace juridico.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
              <KeyRound className="h-5 w-5 text-primary" />
              Acceso protegido por usuario, membership y tenant activo.
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Roles y permisos preparados para separar responsabilidades del estudio.
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
              <Users className="h-5 w-5 text-primary" />
              Base lista para avanzar con clientes, busqueda e historial en S3.
            </div>
          </div>
        </div>

        <Card className="rounded-[2rem] border-border bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Iniciar sesion</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={submit}>
              <Field label="Email laboral" error={fieldErrors.email}>
                <Input
                  autoComplete="email"
                  className="h-12 rounded-2xl border-border bg-secondary px-4"
                  inputMode="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.currentTarget.value)}
                />
              </Field>

              <Field label="Contraseña" error={fieldErrors.password}>
                <Input
                  autoComplete="current-password"
                  className="h-12 rounded-2xl border-border bg-secondary px-4"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.currentTarget.value)}
                />
              </Field>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" className="h-12 w-full rounded-2xl" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Entrar
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Todavia no tenes cuenta?{" "}
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
