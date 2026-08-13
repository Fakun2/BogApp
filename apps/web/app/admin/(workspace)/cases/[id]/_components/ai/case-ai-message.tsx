"use client";

import { AlertTriangle } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import { Badge } from "@/components/ui/badge";
import { CaseAiActions } from "./case-ai-actions";
import { CaseAiSources } from "./case-ai-sources";
import type { CaseAiMessage as CaseAiMessageType } from "./case-ai-types";

export function CaseAiMessage({
  message,
  onCopy,
  onRegenerate
}: {
  message: CaseAiMessageType;
  onCopy: (content: string) => void;
  onRegenerate: () => void;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <Message from={message.role}>
      <MessageContent>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="text-xs font-semibold text-foreground">
            {isAssistant ? "Asistente" : "Vos"}
          </p>
          <time className="shrink-0 text-[11px] text-muted-foreground">
            {message.createdAtLabel}
          </time>
        </div>
        <MessageResponse>{message.content}</MessageResponse>
        {message.confidence === "low" ? (
          <Badge
            className="mt-3 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            variant="outline"
          >
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            Baja confianza
          </Badge>
        ) : null}
        {isAssistant ? (
          <div className="mt-4 grid gap-3">
            <CaseAiSources sources={message.sources ?? []} />
            <CaseAiActions
              disabled={message.confidence === "low"}
              onCopy={() => onCopy(message.content)}
              onRegenerate={onRegenerate}
            />
          </div>
        ) : null}
      </MessageContent>
    </Message>
  );
}
