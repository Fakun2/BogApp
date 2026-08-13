import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type LandingSectionPadding = "default" | "compact" | "cta";
type LandingContainerSize = "wide" | "narrow";

const sectionPadding: Record<LandingSectionPadding, string> = {
  compact: "py-14 md:py-18 lg:py-24",
  cta: "py-14 sm:py-18 md:py-24 lg:py-28",
  default: "py-14 md:py-18 lg:py-24",
};

const containerSize: Record<LandingContainerSize, string> = {
  narrow: "max-w-4xl",
  wide: "max-w-7xl",
};

type LandingSectionProps = ComponentPropsWithoutRef<"section"> & {
  padding?: LandingSectionPadding;
};

type LandingContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: LandingContainerSize;
};

export function LandingSection({
  className,
  padding = "default",
  ...props
}: LandingSectionProps) {
  return (
    <section
      className={cn("bg-card", sectionPadding[padding], className)}
      {...props}
    />
  );
}

export function LandingContainer({
  className,
  size = "wide",
  ...props
}: LandingContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-5 sm:px-12 md:px-16 lg:px-20",
        containerSize[size],
        className,
      )}
      {...props}
    />
  );
}
