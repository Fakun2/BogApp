import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMetricsGrid } from "./_components/admin-metrics-grid";
import {
  adminMetrics,
  adminQuickLinks,
  adminSurfaceClassName,
  adminSurfacePrimaryClassName,
  adminWorkspaceStatus
} from "./_constants/dashboard";

export default function AdminPage() {
  return (
    <div className="grid gap-6">

      <AdminMetricsGrid metrics={adminMetrics} />
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
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {link.description}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground"
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
