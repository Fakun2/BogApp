"use client";

import { usePathname } from "next/navigation";
import { adminNavSections } from "../../_constants/navigation";
import type { AdminSidebarVariant } from "../../_types/admin";
import { getAuthorizedNavSections } from "../../_utils/authorization";
import { isAdminRouteActive } from "../../_utils/navigation";
import type { BogaapSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { SidebarFooterActions } from "./sidebar-footer-actions";
import { SidebarNavSection } from "./sidebar-nav-section";
import { SidebarWorkspaceSwitcher } from "./sidebar-workspace-switcher";

type AdminSidebarProps = {
  onClose?: () => void;
  session: BogaapSession | null;
  variant?: AdminSidebarVariant;
};

export function AdminSidebar({ onClose, session, variant = "desktop" }: AdminSidebarProps) {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const compact = variant === "desktop" && sidebar.state === "collapsed";
  const navSections = getAuthorizedNavSections(session, adminNavSections);

  return (
    <Sidebar
      onMouseEnter={variant === "desktop" ? () => sidebar.setOpen(true) : undefined}
      onMouseLeave={variant === "desktop" ? () => sidebar.setOpen(false) : undefined}
      className={cn(
        "h-full flex-col bg-[var(--admin-sidebar-bg)] text-foreground shadow-[8px_0_24px_-22px_rgba(15,23,42,0.55)]",
        variant === "mobile" && "static flex w-full"
      )}
    >
      <SidebarHeader className={cn(compact ? "px-3 py-4" : "px-5 pb-5 pt-5")}>
        <SidebarWorkspaceSwitcher
          compact={compact}
          onClose={onClose}
          showCloseButton={variant === "mobile"}
        />
      </SidebarHeader>

      <SidebarContent
        className={cn("flex-1 overflow-y-auto", compact ? "px-2 py-2" : "px-4 py-1")}
        aria-label="Navegacion principal"
      >
        {navSections.map((section) => (
          <SidebarNavSection
            key={section.title}
            collapsed={compact}
            items={section.items}
            pathname={pathname}
            title={section.title}
            isActive={isAdminRouteActive}
          />
        ))}
      </SidebarContent>

      {!compact ? <SidebarFooterActions /> : null}
    </Sidebar>
  );
}
