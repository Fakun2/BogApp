import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionEyebrow } from "../ui/section-eyebrow";

const steps = [
  {
    no: "01",
    title: "Cargar el estudio",
    body: "Configura tenant, moneda, areas de practica, roles y usuarios con permisos iniciales."
  },
  {
    no: "02",
    title: "Ordenar expedientes",
    body: "Carga clientes, partes, caratulas, fuero, instancia y responsables por cada caso."
  },
  {
    no: "03",
    title: "Operar el dia a dia",
    body: "Agenda audiencias, crea tareas, registra gastos y monitorea vencimientos."
  }
] as const;

function StepCard({ no, title, body }: { no: string; title: string; body: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border bg-background p-6 shadow-[var(--landing-soft-shadow)]">
      <span className="text-sm font-semibold text-primary">{no}</span>
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

export function Workflow() {
  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <SectionEyebrow>Como funciona</SectionEyebrow>
            <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Del alta del estudio al expediente en movimiento.
            </h2>
          </div>
          <Link href="/create-account" className="inline-flex items-center gap-2 text-sm font-medium">
            Ver flujo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative mt-16 hidden md:block">
          <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
          {steps.map((step, index) => {
            const left = index % 2 === 0;
            return (
              <div key={step.no} className="grid grid-cols-[1fr_72px_1fr] items-center gap-4 py-8">
                <div className={left ? "text-right" : ""}>{left && <StepCard {...step} />}</div>
                <div className="z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background font-semibold text-primary">
                  {index + 1}
                </div>
                <div>{!left && <StepCard {...step} />}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 md:hidden">
          {steps.map((step) => (
            <StepCard key={step.no} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
