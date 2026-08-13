"use client";

import { CaseAiMessage } from "./case-ai-message";
import { cn } from "@/lib/utils";
import type { CaseAiMessage as CaseAiMessageType } from "./case-ai-types";

export function CaseAiMessageList({
  className,
  messages,
  onCopy,
  onRegenerate
}: {
  className?: string;
  messages: CaseAiMessageType[];
  onCopy: (content: string) => void;
  onRegenerate: () => void;
}) {
  return (
    <div className={cn("grid max-h-[560px] min-h-[320px] gap-4 overflow-y-auto pr-1", className)}>
      {messages.map((message) => (
        <CaseAiMessage
          key={message.id}
          message={message}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  );
}
