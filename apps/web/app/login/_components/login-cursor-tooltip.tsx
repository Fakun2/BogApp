"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LoginCursorTooltipProps = {
  inputFocused: boolean;
  label: string;
  visible: boolean;
  x: number;
  y: number;
};

export function LoginCursorTooltip({
  inputFocused,
  label,
  visible,
  x,
  y
}: LoginCursorTooltipProps) {
  const [displayLabel, setDisplayLabel] = useState(label);
  const [textVisible, setTextVisible] = useState(true);
  const targetLabelRef = useRef(label);

  useEffect(() => {
    if (label === targetLabelRef.current) {
      return;
    }

    targetLabelRef.current = label;
    setTextVisible(false);
    setDisplayLabel("");

    let frame = 0;
    const timeout = window.setTimeout(() => {
      setDisplayLabel(label);
      frame = window.requestAnimationFrame(() => setTextVisible(true));
    }, 520);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.clearTimeout(timeout);
    };
  }, [label]);

  return (
    <div
      role="tooltip"
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed z-[70] hidden origin-top-left -translate-y-full translate-x-5 items-center rounded-2xl  bg-[#3a3a3d] px-3 py-2 text-xs font-medium leading-none text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform duration-[420ms] ease-out lg:flex",
        visible ? (inputFocused ? "scale-[1.15]" : "scale-105") : "scale-0"
      )}
      style={{
        left: x - 5,
        top: y + 55,
        fontFamily: "Poppins, Inter, Arial, sans-serif"
      }}
    >
      <span
        className={cn(
          "inline-block overflow-hidden whitespace-nowrap transition-[opacity,transform,width] duration-[520ms] ease-in-out",
          textVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        )}
        style={{ width: displayLabel ? `${displayLabel.length + 0.1}ch` : "0ch" }}
      >
        {displayLabel}
      </span>
      <span className="absolute  -left-0 -top-0 size-3 rotate-180 bg-[#3a3a3d]" />
    </div>
  );
}
