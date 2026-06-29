"use client";

import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateAccountCursor } from "../_hooks/use-create-account-cursor";
import { CreateAccountCursorTooltip } from "./create-account-cursor-tooltip";

export function CreateAccountCursor() {
  const { inputFocused, label, tooltipVisible, visible, x, y } = useCreateAccountCursor();

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed z-[80] hidden origin-top-left -translate-x-0.5 -translate-y-0.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] transition-[opacity,transform] duration-200 ease-out lg:block",
          visible
            ? inputFocused
              ? "scale-125 opacity-100"
              : "scale-110 opacity-100"
            : "scale-75 opacity-0"
        )}
        style={{ left: x, top: y }}
      >
        <MousePointer2 className="h-6 w-6 fill-black stroke-white stroke-[1.2]" />
      </div>

      <CreateAccountCursorTooltip
        inputFocused={inputFocused}
        label={label}
        visible={visible && tooltipVisible}
        x={x}
        y={y}
      />
    </>
  );
}
