import Link from "next/link";
import { ArrowRight, CalendarClock, CheckSquare, FolderKanban, KeyRound } from "lucide-react";
import { bentoStats } from "../data/landing-data";
import { ImagePlaceholder } from "../ui/image-placeholder";
import { SectionEyebrow } from "../ui/section-eyebrow";

export function Features() {
  return (
    <section id="platform" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Plataforma</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Todo lo necesario para operar un{" "}
            <span className="font-serif font-normal italic text-primary">estudio juridico</span>.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Una plataforma unica para crear, seguir y gobernar informacion juridica con permisos
            claros y datos separados por tenant.
          </p>
        </div>

        <div className="lumina-bento-grid mt-14">
          <div className="lumina-bento-a flex min-h-[360px] flex-col rounded-[1.6rem] border border-border bg-card p-6 shadow-[var(--landing-soft-shadow)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Expedientes que se ordenan solos.</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Caratulas, partes, jurisdiccion, fuero, instancia, responsable y actividad en una vista
              pensada para lectura rapida.
            </p>
            <ImagePlaceholder name="case-management-preview.png" className="mt-6 flex-1" />
          </div>

          <div className="lumina-bento-b rounded-[1.6rem] border border-border bg-primary p-6 text-primary-foreground shadow-[var(--landing-soft-shadow)]">
            <CheckSquare className="h-6 w-6" />
            <h3 className="mt-6 text-2xl font-semibold">Flujos componibles</h3>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
              Alta de cliente, expediente, audiencia, tarea y gasto sin saltar entre planillas.
            </p>
            <p className="mt-8 text-6xl font-semibold">6</p>
            <p className="text-sm text-primary-foreground/75">modulos conectados</p>
          </div>

          <div className="lumina-bento-c grid gap-3 rounded-[1.6rem] border border-border bg-card p-4 shadow-[var(--landing-soft-shadow)] md:grid-cols-3">
            {bentoStats.map((item) => (
              <div key={item.stat} className="rounded-2xl bg-background p-5 text-center">
                <p className="text-3xl font-semibold">{item.stat}</p>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="lumina-bento-d rounded-[1.6rem] border border-border bg-card p-6 shadow-[var(--landing-soft-shadow)]">
            <KeyRound className="h-6 w-6 text-primary" />
            <h3 className="mt-6 text-2xl font-semibold">Permisos con memoria</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Cada usuario trabaja desde su membresia, rol y tenant activo.
            </p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Entrar al panel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lumina-bento-e rounded-[1.6rem] border border-border bg-card p-6 shadow-[var(--landing-soft-shadow)]">
            <CalendarClock className="h-6 w-6 text-primary" />
            <h3 className="mt-6 text-2xl font-semibold">Eventos juridicos en tiempo real</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tareas, audiencias y gastos conviven en el calendario del expediente con indicadores
              claros y fechas precargadas.
            </p>
            <ImagePlaceholder name="calendar-events-preview.png" className="mt-6 min-h-64" />
          </div>
        </div>
      </div>
    </section>
  );
}
