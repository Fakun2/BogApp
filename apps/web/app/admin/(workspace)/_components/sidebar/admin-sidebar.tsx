"use client";

import { useMemo } from "react";
import { Folder } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { adminNavSections } from "../../_constants/navigation";
import type { AdminNavSection, AdminSidebarVariant } from "../../_types/admin";
import { getAuthorizedNavSections } from "../../_utils/authorization";
import { isAdminRouteActive } from "../../_utils/navigation";
import type { BogaapSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { libraryKeys, listLibraryFolders } from "../../library/_api/library.api";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
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
  const searchParams = useSearchParams();
  const sidebar = useSidebar();
  const compact = variant === "desktop" && sidebar.state === "collapsed";
  const currentPath = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
  const libraryFoldersQuery = useDashboardQuery({
    permission: "documents:read",
    queryFn: () => listLibraryFolders(),
    queryKey: libraryKeys.folders(),
    staleTime: 30_000
  });
  const navSections = useMemo(
    () =>
      getAuthorizedNavSections(
        session,
        withLibraryFolderShortcuts(adminNavSections, libraryFoldersQuery.data ?? [])
      ),
    [libraryFoldersQuery.data, session]
  );

  return (
    <Sidebar
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
        className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          compact ? "px-2 py-2" : "px-4 py-1"
        )}
        aria-label="Navegacion principal"
      >
        {navSections.map((section) => (
          <SidebarNavSection
            key={section.title}
            collapsed={compact}
            items={section.items}
            pathname={currentPath}
            title={section.title}
            isActive={isAdminRouteActive}
          />
        ))}
      </SidebarContent>

      {!compact ? <SidebarFooterActions /> : null}
    </Sidebar>
  );
}

function withLibraryFolderShortcuts(
  sections: AdminNavSection[],
  folders: Array<{ id: string; name: string }>
) {
  if (!folders.length) {
    return sections;
  }

  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.href !== "/admin/library") {
        return item;
      }

      return {
        ...item,
        children: folders.map((folder) => ({
          href: `/admin/library?folderId=${folder.id}`,
          icon: Folder,
          label: folder.name,
          requiredPermissions: ["documents:read"]
        }))
      };
    })
  }));
}
