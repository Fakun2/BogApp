import { cn } from "@/lib/utils";

export function filterControlClassName(className?: string) {
  return cn(
    "h-11 rounded-xl border-border/50 bg-card px-3 shadow-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10",
    className
  );
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
