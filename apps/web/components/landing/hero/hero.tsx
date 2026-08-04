import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Navbar } from "../navbar/navbar";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      <div className="absolute inset-0 z-0 bg-card/78 backdrop-blur-[1px] dark:bg-card/84" />
      <div className="absolute inset-0 z-0 " />

      <div className="relative">
        <Navbar />
        <div className="mx-auto flex min-h-[calc(100svh-76px)] max-w-7xl flex-col items-center px-5 pb-16 pt-12 text-center sm:px-6 sm:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Gestion juridica para estudios modernos
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-normal text-foreground sm:text-7xl lg:text-8xl">
            El futuro de la gestion{" "}
            <span className="font-serif font-normal italic text-primary">juridica</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Ordena clientes, expedientes, audiencias, tareas, gastos y permisos en una plataforma
            sobria para estudios que necesitan operar con claridad.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/create-account"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_50px_-28px_color-mix(in_oklab,var(--primary)_75%,black)] transition-opacity hover:opacity-90"
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-6 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
            >
              <Play className="h-4 w-4" />
              Agendar Demo
            </Link>
          </div>

          <div className="mt-14 p-8 w-full max-w-6xl">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
