"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AdminNavItem } from "../../_types/admin";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type SidebarNavItemProps = {
  active: boolean;
  collapsed: boolean;
  isActive: (pathname: string, href: string) => boolean;
  item: AdminNavItem;
  pathname: string;
};

export function SidebarNavItem({
  active,
  collapsed,
  isActive,
  item,
  pathname
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const isSoon = item.status === "soon";
  const href = item.href;
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const [open, setOpen] = useState(active);
  const childItems = useMemo(
    () =>
      children.map((child) => ({
        active: isNavItemActive(child, pathname, isActive),
        item: child
      })),
    [children, isActive, pathname]
  );
  const childActive = childItems.some((child) => child.active);
  const itemActive = href ? isActive(pathname, href) && !childActive : active && !childActive;

  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  const buttonClassName = cn(
    collapsed ? "min-h-11 justify-center px-2" : "min-h-9 px-3 text-sm",
    isSoon &&
      "cursor-not-allowed text-muted-foreground/55 hover:bg-transparent hover:text-muted-foreground/55"
  );
  const iconClassName = cn(
    "shrink-0 text-foreground/70",
    collapsed ? "size-4" : "size-3.5",
    itemActive && "text-[var(--admin-sidebar-active-foreground)] opacity-100",
    isSoon && "text-muted-foreground/45"
  );

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <div className="relative">
          {href && !isSoon ? (
            <SidebarMenuButton
              asChild
              isActive={itemActive}
              className={cn(buttonClassName, !collapsed && "pr-8")}
              title={collapsed ? item.label : undefined}
            >
              <Link href={href} aria-current={itemActive ? "page" : undefined}>
                <Icon className={iconClassName} strokeWidth={1.75} aria-hidden="true" />
                {!collapsed ? (
                  <span className="ml-2 min-w-0 flex-1 truncate">{item.label}</span>
                ) : null}
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              isActive={false}
              className={cn(buttonClassName, !collapsed && "pr-8")}
              title={collapsed ? item.label : undefined}
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
            >
              <Icon className={iconClassName} strokeWidth={1.75} aria-hidden="true" />
              {!collapsed ? (
                <span className="ml-2 min-w-0 flex-1 truncate">{item.label}</span>
              ) : null}
            </SidebarMenuButton>
          )}

          {!collapsed ? (
            <button
              type="button"
              className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-label={open ? `Contraer ${item.label}` : `Expandir ${item.label}`}
            >
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-150",
                  open && "rotate-180"
                )}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>

        {!collapsed && open ? (
          <ul className="ml-[21px] grid border-l border-border/45 py-1 pl-4">
            {childItems.map((child) => (
              <SidebarChildNavItem
                key={child.item.href ?? child.item.label}
                active={child.active}
                item={child.item}
              />
            ))}
          </ul>
        ) : null}
      </SidebarMenuItem>
    );
  }

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
          isActive={itemActive}
          className={buttonClassName}
          title={collapsed ? item.label : undefined}
        >
          <Link href={href ?? "#"} aria-current={itemActive ? "page" : undefined}>
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

function SidebarChildNavItem({ active, item }: { active: boolean; item: AdminNavItem }) {
  const isSoon = item.status === "soon";
  const className = cn(
    "relative -ml-px flex min-h-9 items-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active &&
      "bg-[var(--admin-sidebar-active)] text-[var(--admin-sidebar-active-foreground)] shadow-sm hover:bg-[var(--admin-sidebar-active)] hover:text-[var(--admin-sidebar-active-foreground)]",
    isSoon && "cursor-not-allowed text-muted-foreground/50 hover:bg-transparent hover:text-muted-foreground/50"
  );

  return (
    <li className="list-none">
      {item.href && !isSoon ? (
        <Link href={item.href} className={className} aria-current={active ? "page" : undefined}>
          <span className="min-w-0 truncate">{item.label}</span>
        </Link>
      ) : (
        <span className={className}>
          <span className="min-w-0 truncate">{item.label}</span>
          <Badge
            variant="secondary"
            className="ml-auto rounded-md bg-muted px-1.5 py-0 text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground"
          >
            Soon
          </Badge>
        </span>
      )}
    </li>
  );
}

function isNavItemActive(
  item: AdminNavItem,
  pathname: string,
  isActive: (pathname: string, href: string) => boolean
): boolean {
  return Boolean(
    (item.href && isActive(pathname, item.href)) ||
      item.children?.some((child) => isNavItemActive(child, pathname, isActive))
  );
}
