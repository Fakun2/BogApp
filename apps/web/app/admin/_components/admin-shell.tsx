"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { hasPermission } from "@/lib/auth/permissions";
import { useAdminShellState } from "../_hooks/use-admin-shell-state";
import type { AdminShellProps } from "../_types/admin";
import { AdminCommandPalette } from "./command/admin-command-palette";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const {
    commandOpen,
    mobileOpen,
    scrolled,
    session,
    sessionReady,
    setCommandOpen,
    setMobileOpen,
    setScrolled,
    setSidebarOpen,
    sidebarOpen
  } = useAdminShellState();
  const canAccessAdmin = hasPermission(session, "admin:access");

  useEffect(() => {
    if (sessionReady && !session) {
      router.replace("/login");
    }
  }, [router, session, sessionReady]);

  if (!sessionReady || !session) {
    return <main className="min-h-screen bg-[var(--admin-page-bg)]" />;
  }

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="min-h-screen bg-[var(--admin-page-bg)] text-foreground"
    >
      <AdminSidebar session={session} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[280px] max-w-[85vw] gap-0 border-border bg-card p-0"
        >
          <SheetTitle className="sr-only">Navegacion admin</SheetTitle>
          <SheetDescription className="sr-only">
            Menu principal del panel de administracion.
          </SheetDescription>
          <AdminSidebar
            session={session}
            variant="mobile"
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="fixed inset-x-0 top-0 z-20 transition-[left] duration-300 ease-in-out xl:left-[var(--sidebar-width)]">
        <AdminHeader
          onOpenCommand={() => setCommandOpen(true)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          scrolled={scrolled}
          session={session}
        />
      </div>

      <SidebarInset
        className="h-screen overflow-auto"
        onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 4)}
      >
        <div className="w-full px-4 py-10 md:px-10 md:py-10 overflow-y-auto">
          {canAccessAdmin ? children : <RestrictedAdminAccess />}
        </div>
      </SidebarInset>

      <AdminCommandPalette
        open={commandOpen}
        session={session}
        onOpenChange={setCommandOpen}
      />
    </SidebarProvider>
  );
}

function RestrictedAdminAccess() {
  return (
    <Card
      data-admin-surface
      className="mx-auto max-w-xl rounded-xl border-0 bg-card text-card-foreground shadow-[var(--admin-card-shadow)]"
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Panel restringido</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Necesitas permiso de acceso al panel de administracion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
