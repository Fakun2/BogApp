"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" className={cn("min-w-0", className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("inline-flex min-w-0 items-center gap-1.5", className)} {...props} />;
}

function BreadcrumbLink({
  children,
  className,
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn("min-w-0 truncate transition-colors hover:text-foreground", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("min-w-0 truncate font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      className={cn("flex items-center text-muted-foreground/70", className)}
      {...props}
    >
      {children ?? <ChevronRight className="size-3.5" />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-3.5" />
      <span className="sr-only">Mas</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
};
