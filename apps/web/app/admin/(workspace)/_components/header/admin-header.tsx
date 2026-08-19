"use client";

import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminHeaderProps } from "../../_types/admin";
import { AdminUserMenu } from "../user/admin-user-menu";
import { AdminHeaderBreadcrumbs } from "./admin-header-breadcrumbs";
import { HeaderActionButton } from "./header-action-button";
import { HeaderSearchButton } from "./header-search-button";

export function AdminHeader({
  onOpenCommand,
  onOpenMobileSidebar,
  onToggleSidebar,
  scrolled,
  session,
  sidebarOpen
}: AdminHeaderProps) {
  const SidebarToggleIcon = sidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header
      className={cn(
        "flex h-[48px] items-center justify-between px-6 transition-shadow md:px-10",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <HeaderActionButton
          label="Abrir navegacion"
          onClick={onOpenMobileSidebar}
          className="shrink-0 lg:hidden"
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </HeaderActionButton>
        <HeaderActionButton
          label={sidebarOpen ? "Contraer sidebar" : "Desplegar sidebar"}
          onClick={onToggleSidebar}
          className="hidden bg-none shrink-0 lg:inline-flex"
        >
          <SidebarToggleIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </HeaderActionButton>
        <AdminHeaderBreadcrumbs />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <HeaderSearchButton onOpenCommand={onOpenCommand} />

        <HeaderActionButton
          label="Notificaciones"
          className="relative grid size-8 place-items-center rounded-full border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] text-foreground backdrop-blur-xl hover:bg-[var(--dropdown-item-hover)]"
        >
          <Bell className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
          <span
            className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive font-mono text-[9px] font-semibold leading-none text-white ring-2 ring-[var(--admin-page-bg)]"
          >
            0
          </span>
        </HeaderActionButton>

        <div className="flex items-center shrink-0">
          <AdminUserMenu collapsed session={session} triggerVariant="pill" />
        </div>
      </div>
    </header>
  );
}
