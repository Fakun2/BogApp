import type { ReactNode } from "react";

export function TableStateRow({ icon, text }: { icon?: ReactNode; text: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-md border border-dashed border-border/40 text-sm text-muted-foreground lg:min-h-0 lg:flex-1">
      <span className="flex items-center gap-2">
        {icon}
        {text}
      </span>
    </div>
  );
}
