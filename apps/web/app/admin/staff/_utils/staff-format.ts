import { cn } from "@/lib/utils";

export function filterControlClassName(className?: string) {
  return cn(
    "h-11 rounded-xl border-border/50 bg-card px-3 shadow-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10",
    className
  );
}

export function tableActionButtonClassName() {
  return "h-10 w-10 rounded-xl border-border/40 bg-card p-0 text-base font-semibold text-foreground shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)] hover:bg-secondary/40 sm:h-11 sm:w-auto sm:px-4";
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
