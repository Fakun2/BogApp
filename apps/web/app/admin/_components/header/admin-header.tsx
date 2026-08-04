"use client";

import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminPageTitle } from "../../_hooks/use-admin-page-title";
import type { AdminHeaderProps } from "../../_types/admin";
import { AdminUserMenu } from "../user/admin-user-menu";
import { HeaderActionButton } from "./header-action-button";
import { HeaderAvatarGroup } from "./header-avatar-group";
import { HeaderSearchButton } from "./header-search-button";

export function AdminHeader({
  onOpenCommand,
  onOpenMobileSidebar,
  scrolled,
  session
}: AdminHeaderProps) {
  const pageTitle = useAdminPageTitle();

  return (
    <header
      className={cn(
        "flex h-[72px] items-center justify-between px-6 transition-shadow md:px-10",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <HeaderActionButton
          label="Abrir navegacion"
          onClick={onOpenMobileSidebar}
          className="shrink-0 lg:hidden"
        >
          <Menu className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </HeaderActionButton>
        <h1 className="truncate text-lg font-semibold tracking-normal text-foreground">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <HeaderAvatarGroup session={session} />

        <span className="hidden h-7 w-px bg-muted-foreground/20 md:block" aria-hidden="true" />

        <HeaderActionButton label="Notificaciones" className="relative">
          <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-destructive font-mono text-[8px] font-medium leading-none text-white">
            0
          </span>
        </HeaderActionButton>

        <HeaderSearchButton onOpenCommand={onOpenCommand} />

        <div className="shrink-0">
          <AdminUserMenu collapsed session={session} triggerVariant="pill" />
        </div>
      </div>
    </header>
  );
}
