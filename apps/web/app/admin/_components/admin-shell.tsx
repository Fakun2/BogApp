"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UnauthorizedState } from "@/components/ui/not-found";
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
      className="min-h-[100svh] bg-[var(--admin-page-bg)] text-foreground"
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

      <div className="fixed inset-x-0 top-0 z-20 transition-[left] duration-300 ease-in-out lg:left-[var(--sidebar-width)]">
        <AdminHeader
          onOpenCommand={() => setCommandOpen(true)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          scrolled={scrolled}
          session={session}
        />
      </div>

      <SidebarInset
        className="h-[100svh] overflow-auto"
        onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 4)}
      >
        <div className="w-full min-w-0 overflow-y-auto px-4 py-8 md:px-10 md:py-10 2xl:px-12">
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
    <UnauthorizedState
      title="Panel restringido"
      description="Necesitas permisos adicionales para acceder al panel de administracion."
    />
  );
}
