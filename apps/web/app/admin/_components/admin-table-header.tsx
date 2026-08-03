import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { adminSurfacePrimaryClassName } from "../_constants/dashboard";

export function AdminTableHeader({
  actions,
  className = "",
  description,
  descriptionClassName,
  icon: Icon,
  title
}: {
  actions?: ReactNode;
  className?: string;
  description?: string;
  descriptionClassName?: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <CardHeader
      data-admin-table-header
      className={`flex shrink-0 flex-row items-center justify-between gap-4 border-b border-border/30 px-2 py-2 md:px-6 md:py-5 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : null}
        <div className="min-w-0">
          <CardTitle className={`truncate text-lg font-semibold ${adminSurfacePrimaryClassName}`}>
            {title}
          </CardTitle>
          {description ? (
            <p
              className={cn(
                "mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm",
                descriptionClassName
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2 sm:gap-3">{actions}</div> : null}
    </CardHeader>
  );
}
