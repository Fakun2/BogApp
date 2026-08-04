import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ImagePlaceholder } from "../ui/image-placeholder";
import { SectionEyebrow } from "../ui/section-eyebrow";

export function Showcase() {
  return (
    <section className="bg-card py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.86fr_1fr] lg:items-center">
        <div>
          <SectionEyebrow>Operacion en vivo</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Mira al estudio trabajar en tiempo real.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Una fuente transparente de tareas, audiencias, gastos y cambios relevantes. El equipo
            puede intervenir antes de que un vencimiento se convierta en problema.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Cada evento queda asociado al expediente",
              "Alertas antes de vencimientos importantes",
              "Permisos y studios activos en cada accion",
            ].map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {item}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Explorar plataforma <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/create-account"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium"
            >
              Crear cuenta <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-border bg-card p-2 shadow-[var(--landing-soft-shadow)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-semibold">Actividad juridica</p>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              12 activos
            </span>
          </div>
          <ImagePlaceholder name="activity-feed-preview.png" className="min-h-[430px] rounded-t-none border-0" />
          <div className="flex items-center justify-between px-5 py-4 text-xs text-muted-foreground">
            <span>Mostrando 6 de 1.284 eventos hoy</span>
            <span>Ver timeline</span>
          </div>
        </div>
      </div>
    </section>
  );
}
