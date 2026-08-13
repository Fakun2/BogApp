"use client";

import type { AdminNavItem } from "../../_types/admin";
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";

type SidebarNavSectionProps = {
  collapsed: boolean;
  isActive: (pathname: string, href: string) => boolean;
  items: AdminNavItem[];
  pathname: string;
  title: string;
};

export function SidebarNavSection({
  collapsed,
  isActive,
  items,
  pathname,
  title
}: SidebarNavSectionProps) {
  return (
    <SidebarGroup className={cn(collapsed ? "mb-2" : "mb-5")}>
      {!collapsed ? <SidebarGroupLabel>{title}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            item={item}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
