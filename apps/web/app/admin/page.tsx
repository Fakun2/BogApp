import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminMetrics,
  adminQuickLinks,
  adminSurfaceClassName,
  adminSurfaceMutedClassName,
  adminSurfacePrimaryClassName,
  adminWorkspaceStatus
} from "./_constants/dashboard";

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 rounded-full bg-secondary px-3 py-1">
            BOGAP Admin
          </Badge>
          <h2 className="text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
            Dashboard
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Vista inicial del workspace para operar casos, clientes, caja y equipo del estudio.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              data-admin-surface
              key={metric.label}
              className={`${adminSurfaceClassName} gap-4 rounded-xl border-0 py-4 shadow-[var(--admin-card-shadow)]`}
            >
              <CardHeader className="flex-row items-center justify-between gap-3 px-4">
                <CardTitle className={`text-sm font-medium ${adminSurfaceMutedClassName}`}>
                  {metric.label}
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary/70 text-secondary-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent className="px-4">
                <div className={`font-mono text-2xl font-semibold ${adminSurfacePrimaryClassName}`}>
                  {metric.value}
                </div>
                <p className={`mt-1 text-xs ${adminSurfaceMutedClassName}`}>{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card
          data-admin-surface
          className={`${adminSurfaceClassName} rounded-xl border-0 shadow-[var(--admin-card-shadow)]`}
        >
          <CardHeader>
            <CardTitle className={adminSurfacePrimaryClassName}>Accesos operativos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {adminQuickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-16 items-center justify-between rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>
                  <span className={`block font-medium ${adminSurfacePrimaryClassName}`}>
                    {link.label}
                  </span>
                  <span className={`mt-1 block text-xs ${adminSurfaceMutedClassName}`}>
                    {link.description}
                  </span>
                </span>
                <ArrowRight
                  className={`h-4 w-4 ${adminSurfaceMutedClassName}`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card
          data-admin-surface
          className={`${adminSurfaceClassName} rounded-xl border-0 shadow-[var(--admin-card-shadow)]`}
        >
          <CardHeader>
            <CardTitle className={adminSurfacePrimaryClassName}>Estado del workspace</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {adminWorkspaceStatus.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className={adminSurfacePrimaryClassName}>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
