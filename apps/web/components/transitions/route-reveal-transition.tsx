"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RouteRevealTransitionProps = {
  active: boolean;
  className?: string;
  durationMs?: number;
  onRevealed?: () => void;
};

export function RouteRevealTransition({
  active,
  className,
  durationMs = 1000,
  onRevealed
}: RouteRevealTransitionProps) {
  const [mounted, setMounted] = useState(active);
  const [covered, setCovered] = useState(active);

  useEffect(() => {
    if (!active) {
      return;
    }

    setMounted(true);
    setCovered(true);

    const frame = window.requestAnimationFrame(() => setCovered(false));
    const timeout = window.setTimeout(() => {
      setMounted(false);
      onRevealed?.();
    }, durationMs);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [active, durationMs, onRevealed]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-50 bg-black/[0.94] transition-[opacity,backdrop-filter] ease-out",
        covered ? "opacity-100 backdrop-blur-[14px]" : "opacity-0 backdrop-blur-0",
        className
      )}
      style={{ transitionDuration: `${durationMs}ms` }}
    />
  );
}
