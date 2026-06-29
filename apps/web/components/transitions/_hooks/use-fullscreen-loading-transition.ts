"use client";

import { useEffect, useState } from "react";
import { useLoadingEllipsis } from "@/hooks/use-loading-ellipsis";

type UseFullscreenLoadingTransitionOptions = {
  active: boolean;
  coverDuringExit: boolean;
  exiting: boolean;
  exitDurationMs: number;
  introDurationMs: number;
  onExited?: () => void;
  overlayStartDelayMs: number;
  success: boolean;
};

export function useFullscreenLoadingTransition({
  active,
  coverDuringExit,
  exiting,
  exitDurationMs,
  introDurationMs,
  onExited,
  overlayStartDelayMs,
  success
}: UseFullscreenLoadingTransitionOptions) {
  const [contentVisible, setContentVisible] = useState(false);
  const [mounted, setMounted] = useState(active);
  const [progressing, setProgressing] = useState(false);
  const [overlayCovered, setOverlayCovered] = useState(false);
  const ellipsis = useLoadingEllipsis(active && contentVisible && !exiting && !success);

  useEffect(() => {
    if (!active) {
      setContentVisible(false);
      setProgressing(false);
      setOverlayCovered(false);

      const timeout = window.setTimeout(() => setMounted(false), 620);

      return () => window.clearTimeout(timeout);
    }

    setMounted(true);
    setContentVisible(false);
    setProgressing(false);
    setOverlayCovered(false);

    let frame = 0;
    const overlayTimeout = window.setTimeout(() => {
      frame = window.requestAnimationFrame(() => setOverlayCovered(true));
    }, overlayStartDelayMs);

    const contentTimeout = window.setTimeout(() => {
      setContentVisible(true);
      frame = window.requestAnimationFrame(() => setProgressing(true));
    }, overlayStartDelayMs + introDurationMs);

    return () => {
      window.clearTimeout(overlayTimeout);
      window.clearTimeout(contentTimeout);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [active, introDurationMs, overlayStartDelayMs]);

  useEffect(() => {
    if (!active || !exiting) {
      return;
    }

    setContentVisible(false);
    setProgressing(false);

    if (coverDuringExit) {
      setOverlayCovered(true);
      return;
    }

    setOverlayCovered(false);

    const timeout = window.setTimeout(() => {
      setMounted(false);
      onExited?.();
    }, exitDurationMs);

    return () => window.clearTimeout(timeout);
  }, [active, coverDuringExit, exiting, exitDurationMs, onExited]);

  return {
    contentVisible,
    ellipsis,
    mounted,
    overlayCovered,
    progressing
  };
}
