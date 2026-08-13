"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Progress({
  className,
  style,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative h-2 w-full overflow-hidden rounded-full", className)}
      style={{
        backgroundColor:
          "var(--progress-track, color-mix(in oklab, var(--primary) 20%, transparent))",
        ...style
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full transition-all"
        style={{
          backgroundColor: "var(--progress-fill, var(--primary))",
          transform: `translateX(-${100 - (value || 0)}%)`,
          transitionDuration: "var(--progress-duration, 150ms)"
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
