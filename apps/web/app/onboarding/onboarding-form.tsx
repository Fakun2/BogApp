"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Scale,
  Settings2,
  UserRound
} from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const onboardingSchema = z.object({
  owner: z.object({
    fullName: z.string().min(2, "Ingresá el nombre completo."),
    email: z.string().email("Ingresá un email válido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    phone: z.string().min(6, "Ingresá un teléfono o WhatsApp."),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: "Tenés que aceptar los términos." })
    }),
    acceptedPrivacyPolicy: z.literal(true, {
      errorMap: () => ({ message: "Tenés que aceptar la política de privacidad." })
    })
  }),
  tenant: z.object({
    name: z.string().min(2, "Ingresá el nombre del estudio."),
    legalName: z.string().min(2, "Ingresá la razón social o nombre legal."),
    taxId: z.string().min(6, "Ingresá CUIT/CUIL/identificador fiscal."),
    country: z.string().min(2),
    province: z.string().min(2, "Ingresá la provincia."),
    city: z.string().min(2, "Ingresá la ciudad."),
    timezone: z.string().min(2),
    defaultCurrency: z.string().length(3),
    address: z.string().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    size: z.string().optional(),
    mainPracticeAreas: z.array(z.string()),
    referralSource: z.string().optional()
  }),
  workspace: z.object({
    practiceAreas: z.array(z.string().min(2)).min(1, "Agregá al menos un área."),
    defaultRoleForInvites: z.enum(["admin", "lawyer", "paralegal", "accounting", "viewer"]),
    caseNumberingMode: z.enum(["manual", "automatic"]),
    documentStorageMode: z.enum(["local", "s3"])
  })
});

type OnboardingFormState = z.infer<typeof onboardingSchema>;

const initialState: OnboardingFormState = {
  owner: {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    acceptedTerms: false as true,
    acceptedPrivacyPolicy: false as true
  },
  tenant: {
    name: "",
    legalName: "",
    taxId: "",
    country: "Argentina",
    province: "",
    city: "",
    timezone: "America/Argentina/Buenos_Aires",
    defaultCurrency: "ARS",
    address: "",
    website: "",
    logoUrl: "",
    size: "",
    mainPracticeAreas: [],
    referralSource: ""
  },
  workspace: {
    practiceAreas: ["Laboral"],
    defaultRoleForInvites: "lawyer",
    caseNumberingMode: "manual",
    documentStorageMode: "local"
  }
};

const steps = [
  {
    title: "Cuenta owner",
    eyebrow: "Identidad",
    description: "Datos mínimos del usuario que administra el estudio.",
    icon: UserRound
  },
  {
    title: "Estudio jurídico",
    eyebrow: "Tenant",
    description: "Datos legales y ubicación del estudio dentro del SaaS.",
    icon: BriefcaseBusiness
  },
  {
    title: "Workspace",
    eyebrow: "Configuración",
    description: "Preferencias iniciales para operar causas, equipo y documentos.",
    icon: Settings2
  }
] as const;

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingFormState>(initialState);
  const [practiceAreasText, setPracticeAreasText] = useState("Laboral");
  const [mainAreasText, setMainAreasText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ tenantId: string; userId: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentStep = steps[step] ?? steps[0];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function updateOwner<K extends keyof OnboardingFormState["owner"]>(
    key: K,
    value: OnboardingFormState["owner"][K]
  ) {
    setForm((current) => ({ ...current, owner: { ...current.owner, [key]: value } }));
  }

  function updateTenant<K extends keyof OnboardingFormState["tenant"]>(
    key: K,
    value: OnboardingFormState["tenant"][K]
  ) {
    setForm((current) => ({ ...current, tenant: { ...current.tenant, [key]: value } }));
  }

  function updateWorkspace<K extends keyof OnboardingFormState["workspace"]>(
    key: K,
    value: OnboardingFormState["workspace"][K]
  ) {
    setForm((current) => ({ ...current, workspace: { ...current.workspace, [key]: value } }));
  }

  function parseList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload = {
      ...form,
      tenant: {
        ...form.tenant,
        mainPracticeAreas: parseList(mainAreasText)
      },
      workspace: {
        ...form.workspace,
        practiceAreas: parseList(practiceAreasText)
      }
    };

    const parsed = onboardingSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisá los datos del formulario.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/onboarding/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "No se pudo completar el onboarding.");
      }

      const body = (await response.json()) as { tenantId: string; userId: string };
      setResult(body);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo completar el onboarding.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader className="gap-3">
              <Badge variant="secondary" className="w-fit gap-2">
                <Scale className="h-4 w-4" />
                BOGAP
              </Badge>
              <div>
                <CardTitle className="text-2xl">Alta del estudio</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Onboarding progresivo para crear el tenant, el owner y la configuración base.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Progress value={progress} />
              <nav className="space-y-2">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === step;
                  const done = index < step || Boolean(result);

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-secondary"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                      onClick={() => setStep(index)}
                      disabled={submitting}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-md border ${
                          done
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className="block text-xs text-muted-foreground">{item.eyebrow}</span>
                        <span className="block text-sm font-medium">{item.title}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <SummaryRow label="Owner" value={form.owner.fullName || "Pendiente"} />
              <SummaryRow label="Email" value={form.owner.email || "Pendiente"} />
              <SummaryRow label="Estudio" value={form.tenant.name || "Pendiente"} />
              <SummaryRow label="Provincia" value={form.tenant.province || "Pendiente"} />
              <SummaryRow label="Áreas" value={practiceAreasText || "Pendiente"} />
            </CardContent>
          </Card>
        </aside>

        <section>
          <Card className="min-h-[720px]">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <Badge variant="outline">{currentStep.eyebrow}</Badge>
                  <CardTitle className="mt-3 text-2xl">{currentStep.title}</CardTitle>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {currentStep.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  Paso {step + 1} de {steps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {result ? (
                <SuccessState result={result} />
              ) : (
                <form className="flex flex-col gap-6" onSubmit={submit}>
                  {step === 0 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Nombre completo"
                        description="Nombre visible dentro del estudio."
                      >
                        <Input
                          value={form.owner.fullName}
                          onChange={(event) => updateOwner("fullName", event.currentTarget.value)}
                          placeholder="Mateo Alvarez"
                        />
                      </Field>
                      <Field label="Email laboral" description="Se usará para iniciar sesión.">
                        <Input
                          type="email"
                          value={form.owner.email}
                          onChange={(event) => updateOwner("email", event.currentTarget.value)}
                          placeholder="mateo@estudio.com"
                        />
                      </Field>
                      <Field label="Contraseña" description="Mínimo 8 caracteres.">
                        <Input
                          type="password"
                          value={form.owner.password}
                          onChange={(event) => updateOwner("password", event.currentTarget.value)}
                        />
                      </Field>
                      <Field label="Teléfono / WhatsApp" description="Canal de contacto operativo.">
                        <Input
                          value={form.owner.phone}
                          onChange={(event) => updateOwner("phone", event.currentTarget.value)}
                          placeholder="+5493815555555"
                        />
                      </Field>
                      <div className="md:col-span-2 grid gap-3 rounded-md border border-border bg-secondary/60 p-4">
                        <label className="flex items-start gap-3 text-sm">
                          <Checkbox
                            checked={form.owner.acceptedTerms}
                            onCheckedChange={(checked) =>
                              updateOwner("acceptedTerms", (checked === true) as true)
                            }
                          />
                          <span>Acepto los términos de uso de BOGAP.</span>
                        </label>
                        <label className="flex items-start gap-3 text-sm">
                          <Checkbox
                            checked={form.owner.acceptedPrivacyPolicy}
                            onCheckedChange={(checked) =>
                              updateOwner("acceptedPrivacyPolicy", (checked === true) as true)
                            }
                          />
                          <span>Acepto la política de privacidad.</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field label="Nombre comercial">
                        <Input
                          value={form.tenant.name}
                          onChange={(event) => updateTenant("name", event.currentTarget.value)}
                          placeholder="Estudio Alvarez"
                        />
                      </Field>
                      <Field label="Razón social / nombre legal">
                        <Input
                          value={form.tenant.legalName}
                          onChange={(event) => updateTenant("legalName", event.currentTarget.value)}
                          placeholder="Estudio Jurídico Alvarez"
                        />
                      </Field>
                      <Field label="CUIT / CUIL">
                        <Input
                          value={form.tenant.taxId}
                          onChange={(event) => updateTenant("taxId", event.currentTarget.value)}
                          placeholder="20-12345678-9"
                        />
                      </Field>
                      <Field label="País">
                        <Input
                          value={form.tenant.country}
                          onChange={(event) => updateTenant("country", event.currentTarget.value)}
                        />
                      </Field>
                      <Field label="Provincia">
                        <Input
                          value={form.tenant.province}
                          onChange={(event) => updateTenant("province", event.currentTarget.value)}
                          placeholder="Tucumán"
                        />
                      </Field>
                      <Field label="Ciudad">
                        <Input
                          value={form.tenant.city}
                          onChange={(event) => updateTenant("city", event.currentTarget.value)}
                          placeholder="San Miguel de Tucumán"
                        />
                      </Field>
                      <Field label="Domicilio">
                        <Input
                          value={form.tenant.address}
                          onChange={(event) => updateTenant("address", event.currentTarget.value)}
                        />
                      </Field>
                      <Field label="Sitio web">
                        <Input
                          value={form.tenant.website}
                          onChange={(event) => updateTenant("website", event.currentTarget.value)}
                          placeholder="https://estudio.com"
                        />
                      </Field>
                      <Field label="Áreas principales" description="Separadas por coma.">
                        <Textarea
                          value={mainAreasText}
                          placeholder="Laboral, Familia"
                          onChange={(event) => setMainAreasText(event.currentTarget.value)}
                        />
                      </Field>
                      <Field label="Cómo conoció BOGAP">
                        <Textarea
                          value={form.tenant.referralSource}
                          onChange={(event) =>
                            updateTenant("referralSource", event.currentTarget.value)
                          }
                        />
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Áreas de práctica iniciales"
                        description="Se crearán como catálogo del tenant."
                      >
                        <Textarea
                          value={practiceAreasText}
                          placeholder="Laboral, Familia"
                          onChange={(event) => setPracticeAreasText(event.currentTarget.value)}
                        />
                      </Field>
                      <Field label="Rol por defecto para invitaciones">
                        <Select
                          value={form.workspace.defaultRoleForInvites}
                          onValueChange={(value) =>
                            updateWorkspace(
                              "defaultRoleForInvites",
                              value as OnboardingFormState["workspace"]["defaultRoleForInvites"]
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lawyer">Abogado</SelectItem>
                            <SelectItem value="paralegal">Paralegal</SelectItem>
                            <SelectItem value="accounting">Contabilidad</SelectItem>
                            <SelectItem value="viewer">Lectura</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Numeración de causas">
                        <Select
                          value={form.workspace.caseNumberingMode}
                          onValueChange={(value) =>
                            updateWorkspace(
                              "caseNumberingMode",
                              value as OnboardingFormState["workspace"]["caseNumberingMode"]
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automática</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Almacenamiento de documentos">
                        <Select
                          value={form.workspace.documentStorageMode}
                          onValueChange={(value) =>
                            updateWorkspace(
                              "documentStorageMode",
                              value as OnboardingFormState["workspace"]["documentStorageMode"]
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="s3">S3</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  )}

                  {error && (
                    <p className="rounded-md border border-border bg-secondary p-3 text-sm">
                      {error}
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={step === 0 || submitting}
                      onClick={() => setStep((current) => Math.max(current - 1, 0))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Atrás
                    </Button>
                    {step < steps.length - 1 ? (
                      <Button type="button" onClick={() => setStep((current) => current + 1)}>
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Crear estudio
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  description,
  children
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
      {description && <p className="text-xs leading-5 text-muted-foreground">{description}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-40 text-right font-medium">{value}</span>
    </div>
  );
}

function SuccessState({ result }: { result: { tenantId: string; userId: string } }) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-md border border-border bg-secondary/70 p-6">
        <CheckCircle2 className="h-9 w-9 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">Estudio creado</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            El tenant quedó activo y el usuario owner ya tiene acceso inicial.
          </p>
        </div>
      </div>
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <SummaryRow label="Tenant ID" value={result.tenantId} />
        <SummaryRow label="User ID" value={result.userId} />
      </div>
    </div>
  );
}
