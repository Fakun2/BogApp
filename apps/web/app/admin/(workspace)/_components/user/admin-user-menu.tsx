"use client";

import { useRouter } from "next/navigation";
import { Beaker, ChevronDown, Circle, FileText, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { redirectToLoginForLogout } from "@/lib/auth/logout";
import type { BogaapSession } from "@/lib/auth/session";
import { useTheme } from "@/lib/theme/theme-provider";
import { cn } from "@/lib/utils";
import { getInitials, getSessionDisplayUser } from "../../_utils/user";

type AdminUserMenuProps = {
  collapsed?: boolean;
  session: BogaapSession | null;
  triggerVariant?: "avatar" | "pill";
};

export function AdminUserMenu({
  collapsed = false,
  session,
  triggerVariant = "avatar"
}: AdminUserMenuProps) {
  const router = useRouter();
  const theme = useTheme();
  const { displayName, email } = getSessionDisplayUser(session);
  const initials = getInitials(displayName);

  function logout() {
    redirectToLoginForLogout(router);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-admin-surface={triggerVariant === "pill" ? true : undefined}
          type="button"
          className={cn(
            "flex min-h-14 w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "min-h-9 justify-center rounded-full p-0",
            triggerVariant === "pill" &&
              "h-10 min-h-10 w-auto gap-2 rounded-md border-0 bg-card px-2.5 py-1 shadow-[var(--admin-header-control-shadow)] hover:bg-secondary/70"
          )}
          aria-label="Abrir menu de usuario"
        >
          <Avatar
            size={collapsed ? "default" : "lg"}
            className={cn(collapsed ? "size-8" : "size-10", triggerVariant === "pill" && "size-8")}
          >
            <AvatarFallback className="border-0 bg-secondary text-sm font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium">{displayName}</span>
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            </span>
          ) : null}
          {triggerVariant === "pill" ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-md border-border/80 p-0 shadow-lg">
        <DropdownMenuLabel className="px-3 py-2.5">
          <span className="block truncate text-sm font-medium leading-5">{displayName}</span>
          <span className="block truncate text-xs font-normal leading-5 text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0 bg-border/80" />
        <DropdownMenuItem className="rounded-none px-3 py-2 text-[13px] text-muted-foreground focus:bg-secondary/70 focus:text-foreground">
          <User className="h-4 w-4 opacity-70" />
          Cuenta
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none px-3 py-2 text-[13px] text-muted-foreground focus:bg-secondary/70 focus:text-foreground">
          <Beaker className="h-4 w-4 opacity-70" />
          Funciones beta
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none px-3 py-2 text-[13px] text-muted-foreground focus:bg-secondary/70 focus:text-foreground">
          <FileText className="h-4 w-4 opacity-70" />
          Novedades
        </DropdownMenuItem>

        <DropdownMenuSeparator className="m-0 bg-border/80" />
        <div className="px-3 pb-1.5 pt-2 text-[13px] text-muted-foreground">Color</div>
        <ThemeOption
          active={theme.colorMode === "navy-slate"}
          label="Navy slate"
          onSelect={() => theme.setColorMode("navy-slate")}
        />
        <ThemeOption
          active={theme.colorMode === "light-dark"}
          label="Light dark"
          onSelect={() => theme.setColorMode("light-dark")}
        />

        <DropdownMenuSeparator className="m-0 mt-1 bg-border/80" />
        <div className="px-3 pb-1.5 pt-2 text-[13px] text-muted-foreground">Modo</div>
        <ThemeOption
          active={theme.variant === "dark"}
          label="Dark"
          onSelect={() => theme.setVariant("dark")}
        />
        <ThemeOption
          active={theme.variant === "light"}
          label="Light"
          onSelect={() => theme.setVariant("light")}
        />

        <DropdownMenuSeparator className="m-0 mt-1 bg-border/80" />
        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
          className="rounded-none px-3 py-2.5 text-[13px]"
        >
          <LogOut className="h-4 w-4 opacity-70" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeOption({
  active,
  label,
  onSelect
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      className="rounded-none px-3 py-1.5 pl-9 text-[13px] text-muted-foreground focus:bg-secondary/70 focus:text-foreground"
      onSelect={(event) => {
        event.preventDefault();
        onSelect();
      }}
    >
      {active ? (
        <Circle className="absolute left-3 h-2 w-2 fill-current text-muted-foreground" />
      ) : null}
      {label}
    </DropdownMenuItem>
  );
}
