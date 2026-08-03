import Link from "next/link";
import { BadgeCheck, BriefcaseBusiness, Database, KeyRound, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeModeSelect } from "@/components/theme/theme-mode-select";

const modules = [
  {
    name: "Tenancy + RBAC",
    description: "Tenants, usuarios, roles y membresias por estudio.",
    icon: KeyRound
  },
  {
    name: "Clientes juridicos",
    description: "Personas humanas, sociedades y partes contrarias.",
    icon: BriefcaseBusiness
  },
  {
    name: "Causas",
    description: "Expedientes, participantes, jurisdiccion, fuero e instancia.",
    icon: Scale
  },
  {
    name: "Finanzas",
    description: "Cuenta corriente, caja, monedas, gastos y movimientos.",
    icon: Database
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-8 px-6 py-10 lg:px-8 2xl:px-12">
          <div className="flex justify-end">
            <ThemeModeSelect />
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Monolito modular listo para evolucionar
              </Badge>
              <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
                BOGAP
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Plataforma SaaS B2B para estudios juridicos con NestJS, Next.js, PostgreSQL, Redis,
                Prisma, Orval, Tailwind y shadcn/ui.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/create-account">Crear cuenta</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1920px] gap-4 px-6 py-8 lg:grid-cols-4 lg:px-8 2xl:px-12">
        {modules.map((module) => (
          <Card key={module.name}>
            <CardHeader>
              <module.icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{module.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
