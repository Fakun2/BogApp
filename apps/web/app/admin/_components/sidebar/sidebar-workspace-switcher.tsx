"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarWorkspaceSwitcherProps = {
  compact: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
};

export function SidebarWorkspaceSwitcher({
  compact,
  onClose,
  showCloseButton = false
}: SidebarWorkspaceSwitcherProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <>
      <div className={cn("flex items-center", compact ? "justify-center" : "justify-between")}>
        <Link
          href="/admin"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact && "justify-center"
          )}
          aria-label="BOGAP admin"
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-btn-primary text-[11px] font-medium text-btn-primary-foreground">
            B
          </span>
          {!compact ? (
            <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">
              BOGAP
            </span>
          ) : null}
        </Link>
        {showCloseButton && !compact ? (
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground  transition-colors hover:bg-secondary/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClose}
            aria-label="Cerrar navegacion"
          >
            <PanelLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {!compact ? (
        <button
          type="button"
          className="mt-5 flex min-h-12 w-full items-center justify-between rounded-md bg-background px-3.5 py-2 text-left text-[13px] font-normal text-foreground shadow-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cambiar usuario o workspace"
          aria-expanded={workspaceOpen}
          onClick={() => setWorkspaceOpen((value) => !value)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              BG
            </span>
            <span className="min-w-0">
              <span className="block truncate leading-4">Estudio BOGAP</span>
              <span className="block truncate text-[11px] font-light leading-3 text-muted-foreground">
                Workspace legal
              </span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
              workspaceOpen && "rotate-180"
            )}
            strokeWidth={1.75}
          />
        </button>
      ) : null}
    </>
  );
}
