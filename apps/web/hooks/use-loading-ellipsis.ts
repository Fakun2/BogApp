"use client";

import { useEffect, useState } from "react";

const ellipsisSequence = [".", "..", "...", "..", ".", ""];

export function useLoadingEllipsis(active: boolean, intervalMs = 360) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % ellipsisSequence.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [active, intervalMs]);

  return ellipsisSequence[index];
}
