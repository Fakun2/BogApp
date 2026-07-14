"use client";

import { Moon, Sparkles } from "lucide-react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useTheme } from "@/lib/theme/theme-provider";
import { cn } from "@/lib/utils";

export function SidebarFooterActions() {
  const theme = useTheme();

  return (
    <SidebarFooter className="px-5 pb-5 pt-3">
      <button
        type="button"
        className="mb-4 flex h-8 w-full items-center justify-between rounded-md px-2 text-[13px] font-normal text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={theme.toggleVariant}
        aria-label="Cambiar entre light y dark mode"
      >
        <span className="flex items-center gap-2">
          <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {theme.isDark ? "Light Mode" : "Dark Mode"}
        </span>
        <span
          className={cn(
            "flex h-4 w-8 items-center rounded-full bg-background p-0.5 transition-colors",
            theme.isDark && "bg-btn-primary"
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              "size-3 rounded-full bg-muted-foreground/40 transition-transform",
              theme.isDark && "translate-x-4 bg-btn-primary-foreground"
            )}
          />
        </span>
      </button>

      <div className="rounded-xl bg-background p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-btn-primary" strokeWidth={1.75} />
          Upgrade to
          <span className="rounded-md bg-btn-primary px-1.5 py-0.5 text-[10px] font-medium text-btn-primary-foreground">
            Premium
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
          Tu workspace premium expira en <span className="font-medium text-foreground">18 dias</span>.
        </p>
        <button
          type="button"
          className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 text-[12px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Upgrade Now
        </button>
      </div>
    </SidebarFooter>
  );
}
