"use client";

import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { CreateAccountCursor } from "./_components/create-account-cursor";
import { CreateAccountMedia } from "./_components/create-account-media";
import { CreateAccountPanel } from "./_components/create-account-panel";
import { createAccountCopy } from "./_constants/create-account.constants";
import { useCreateAccountForm } from "./_hooks/use-create-account-form";

type CursorState = {
  label: string;
  tooltipVisible: boolean;
  visible: boolean;
  x: number;
  y: number;
};

export default function CreateAccountPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [cursor, setCursor] = useState<CursorState>({
    label: createAccountCopy.formTooltip,
    tooltipVisible: false,
    visible: false,
    x: 0,
    y: 0
  });
  const formState = useCreateAccountForm();

  function updateCursor(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    const isElement = target instanceof Element;
    const isFormTarget = isElement && Boolean(target.closest("[data-create-account-form]"));
    const isSubmitTarget = isElement && Boolean(target.closest("[data-create-account-submit]"));

    setCursor({
      label: isSubmitTarget ? createAccountCopy.submitTooltip : createAccountCopy.formTooltip,
      tooltipVisible: isFormTarget && !formState.submitting,
      visible: true,
      x: event.clientX,
      y: event.clientY
    });
  }

  return (
    <main
      className={cn(
        "min-h-screen bg-[#0d0d0d] text-foreground transition-colors lg:h-screen lg:cursor-none lg:overflow-hidden lg:px-3 lg:py-12 lg:[&_*]:cursor-none",
        darkMode && "dark"
      )}
      onMouseEnter={updateCursor}
      onMouseMove={updateCursor}
      onMouseLeave={() =>
        setCursor((current) => ({ ...current, tooltipVisible: false, visible: false }))
      }
    >
      <div className="mx-auto grid min-h-screen w-full gap-3 lg:h-full lg:min-h-0 lg:max-w-[1800px] lg:grid-cols-[530px_1fr]">
        <CreateAccountPanel
          darkMode={darkMode}
          formState={formState}
          onToggleTheme={() => setDarkMode((current) => !current)}
        />
        <CreateAccountMedia />
      </div>
      <CreateAccountCursor
        label={cursor.label}
        tooltipVisible={cursor.tooltipVisible}
        visible={cursor.visible}
        x={cursor.x}
        y={cursor.y}
      />
    </main>
  );
}
