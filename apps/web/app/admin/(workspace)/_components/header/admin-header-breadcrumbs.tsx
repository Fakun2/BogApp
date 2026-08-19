"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { adminPageTitles } from "../../_constants/navigation";
import { isAdminRouteActive } from "../../_utils/navigation";
import { useAdminHeaderBreadcrumbs } from "./admin-header-breadcrumbs-context";

export function AdminHeaderBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
  const { breadcrumbs } = useAdminHeaderBreadcrumbs();
  const items = breadcrumbs?.length ? breadcrumbs : getRouteBreadcrumbs(currentPath);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItem key={`${item.href ?? item.label}:${index}`} className="min-w-0">
              {index > 0 ? <BreadcrumbSeparator /> : null}
              {item.href && !isLast ? (
                <BreadcrumbLink href={item.href} className="max-w-[14rem]">
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-[18rem] text-lg">{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function getRouteBreadcrumbs(currentPath: string) {
  const currentTitle =
    adminPageTitles.find((item) => isAdminRouteActive(currentPath, item.href))?.title ?? "Admin";

  if (currentPath === "/admin") {
    return [{ label: currentTitle }];
  }

  return [
    { href: "/admin", label: "Dashboard" },
    { label: currentTitle }
  ];
}
