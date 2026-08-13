"use client";

import type { ChatStatus } from "ai";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import type { CaseAiStatus } from "./case-ai-types";

export function CaseAiComposer({
  ariaLabel = "Mensaje para el asistente del expediente",
  className,
  disabled,
  disclaimer = "Borrador asistido, requiere revision profesional.",
  footer,
  onSubmit,
  placeholder = "Preguntar sobre estado, proximos pasos o resumen del expediente",
  status
}: {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  disclaimer?: string;
  footer?: React.ReactNode;
  onSubmit: (message: string) => void;
  placeholder?: string;
  status: CaseAiStatus;
}) {
  const isBlocked = disabled || status === "loading";
  const chatStatus: ChatStatus | undefined = status === "loading" ? "submitted" : undefined;

  return (
    <div className={cn("border-t border-border/70 pt-3", className)}>
      <PromptInput
        className="w-full"
        onSubmit={({ text }) => {
          const trimmedText = text.trim();
          if (!trimmedText || isBlocked) {
            return;
          }

          onSubmit(trimmedText);
        }}
      >
        <PromptInputTextarea
          aria-label={ariaLabel}
          disabled={isBlocked}
          placeholder={placeholder}
        />
        <PromptInputFooter>
          <PromptInputTools className="flex-wrap">
            {footer}
            <span className="text-xs font-medium text-muted-foreground">{disclaimer}</span>
          </PromptInputTools>
          <PromptInputSubmit disabled={isBlocked} status={chatStatus} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
