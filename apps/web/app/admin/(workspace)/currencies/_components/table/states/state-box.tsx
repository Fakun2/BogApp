import type { ReactNode } from "react";

export function StateBox({
  fill = false,
  icon,
  text,
  tone = "muted"
}: {
  fill?: boolean;
  icon?: ReactNode;
  text: string;
  tone?: "error" | "muted";
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-6 text-center text-sm ${fill ? "h-full min-h-0" : "min-h-44"} ${tone === "error" ? "bg-destructive/5 text-destructive" : "text-muted-foreground"}`}
    >
      {icon}
      {text}
    </div>
  );
}
