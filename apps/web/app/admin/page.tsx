import { Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <section className="flex min-h-[calc(100vh-32px)] items-center justify-center rounded-2xl border border-border bg-card px-6 py-12 md:min-h-[calc(100vh-48px)]">
        <div className="w-full max-w-3xl">
          <Badge variant="outline" className="mb-6 rounded-full bg-secondary px-3 py-1">
            <Scale className="h-4 w-4" />
            BOGAP
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-normal">
            Admin BOGAP
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Workspace cargado. Desde aca vamos a construir el panel operativo del estudio.
          </p>
          <div className="mt-8 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <span className="text-xs text-muted-foreground">Estado</span>
              <p className="mt-2 font-medium">Activo</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <span className="text-xs text-muted-foreground">Modulo</span>
              <p className="mt-2 font-medium">Administracion</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <span className="text-xs text-muted-foreground">Acceso</span>
              <p className="mt-2 font-medium">Tenant listo</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
