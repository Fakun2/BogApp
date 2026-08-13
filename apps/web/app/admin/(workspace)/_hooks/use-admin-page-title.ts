"use client";

import { usePathname } from "next/navigation";
import { adminPageTitles } from "../_constants/navigation";
import { isAdminRouteActive } from "../_utils/navigation";

export function useAdminPageTitle() {
  const pathname = usePathname();

  return (
    adminPageTitles.find((item) => isAdminRouteActive(pathname, item.href))?.title ?? "Admin"
  );
}
