"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateAccountCursorProps = {
  label: string;
  tooltipVisible: boolean;
  visible: boolean;
  x: number;
  y: number;
};

export function CreateAccountCursor({
  label,
  tooltipVisible,
  visible,
  x,
  y
}: CreateAccountCursorProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed z-[60] hidden -translate-x-0.5 -translate-y-0.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] transition-opacity duration-150 lg:block",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{ left: x, top: y }}
      >
        <MousePointer2 className="h-5 w-5 fill-white stroke-black stroke-[1.8]" />
      </div>

      <CreateAccountCursorTooltip label={label} visible={visible && tooltipVisible} x={x} y={y} />
    </>
  );
}

function CreateAccountCursorTooltip({
  label,
  visible,
  x,
  y
}: Pick<CreateAccountCursorProps, "label" | "visible" | "x" | "y">) {
  const [activeLabel, setActiveLabel] = useState(label);
  const [previousLabel, setPreviousLabel] = useState<string | null>(null);
  const [textTransitionActive, setTextTransitionActive] = useState(true);
  const activeLabelRef = useRef(label);

  useEffect(() => {
    if (label === activeLabelRef.current) {
      return;
    }

    setPreviousLabel(activeLabelRef.current);
    activeLabelRef.current = label;
    setActiveLabel(label);
    setTextTransitionActive(false);

    const frame = window.requestAnimationFrame(() => setTextTransitionActive(true));
    const timeout = window.setTimeout(() => setPreviousLabel(null), 180);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [label]);

  return (
    <div
      role="tooltip"
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed z-50 hidden -translate-y-full translate-x-4 items-center rounded-md bg-[#1f1f1f] px-2.5 py-1.5 text-[11px] font-medium leading-none text-white shadow-lg shadow-black/25 transition duration-200 ease-out lg:flex",
        visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      )}
      style={{
        left: x,
        top: y - 10
      }}
    >
      <span className="relative grid min-w-10 overflow-hidden">
        {previousLabel ? (
          <span
            className={cn(
              "col-start-1 row-start-1 transition duration-200 ease-out",
              textTransitionActive ? "-translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            )}
          >
            {previousLabel}
          </span>
        ) : null}
        <span
          key={activeLabel}
          className={cn(
            "col-start-1 row-start-1 transition duration-200 ease-out",
            previousLabel && !textTransitionActive
              ? "translate-y-1 opacity-0"
              : "translate-y-0 opacity-100"
          )}
        >
          {activeLabel}
        </span>
      </span>
      <span className="absolute -bottom-1 left-3 size-2 rotate-45 bg-[#1f1f1f]" />
    </div>
  );
}
