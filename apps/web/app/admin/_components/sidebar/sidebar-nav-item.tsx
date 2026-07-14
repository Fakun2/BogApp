"use client";

import Link from "next/link";
import type { AdminNavItem } from "../../_types/admin";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type SidebarNavItemProps = {
  active: boolean;
  collapsed: boolean;
  item: AdminNavItem;
};

export function SidebarNavItem({ active, collapsed, item }: SidebarNavItemProps) {
  const Icon = item.icon;
  const isSoon = item.status === "soon";
  const buttonClassName = cn(
    collapsed ? "min-h-12 justify-center px-2" : "min-h-10 px-3 text-sm",
    isSoon &&
      "cursor-not-allowed text-muted-foreground/55 hover:bg-transparent hover:text-muted-foreground/55"
  );
  const iconClassName = cn(
    "shrink-0 text-foreground/70",
    collapsed ? "size-4" : "size-3.5",
    active && "fill-current text-[var(--admin-sidebar-active-foreground)] opacity-100",
    isSoon && "text-muted-foreground/45"
  );

  return (
    <SidebarMenuItem>
      {isSoon ? (
        <SidebarMenuButton
          disabled
          isActive={false}
          className={buttonClassName}
          title={collapsed ? `${item.label} - Soon` : undefined}
        >
          <Icon
            className={iconClassName}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {!collapsed ? (
            <>
              <span className="ml-2 truncate">{item.label}</span>
              <Badge
                variant="secondary"
                className="ml-auto rounded-md bg-muted px-1.5 py-0 text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground"
              >
                Soon
              </Badge>
            </>
          ) : null}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          asChild
          isActive={active}
          className={buttonClassName}
          title={collapsed ? item.label : undefined}
        >
          <Link href={item.href} aria-current={active ? "page" : undefined}>
            <Icon
              className={iconClassName}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {!collapsed ? <span className="ml-2 truncate">{item.label}</span> : null}
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
