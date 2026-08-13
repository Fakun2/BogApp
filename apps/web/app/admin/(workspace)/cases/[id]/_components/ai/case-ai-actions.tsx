"use client";

import { Clipboard, FilePlus2, RefreshCw, Save, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type CaseAiActionsProps = {
  disabled?: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
};

const disabledActionClassName =
  "h-8 w-8 shrink-0 rounded-md border-border/70 bg-background/70 p-0 text-muted-foreground shadow-none";

export function CaseAiActions({ disabled, onCopy, onRegenerate }: CaseAiActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1.5">
        <ActionButton label="Copiar respuesta" onClick={onCopy}>
          <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
        <ActionButton disabled={disabled} label="Guardar resumen">
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
        <ActionButton disabled={disabled} label="Crear borrador">
          <FilePlus2 className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
        <ActionButton label="Regenerar" onClick={onRegenerate}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
        <ActionButton disabled={disabled} label="Util">
          <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
        <ActionButton disabled={disabled} label="No util">
          <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
        </ActionButton>
      </div>
    </TooltipProvider>
  );
}

function ActionButton({
  children,
  disabled,
  label,
  onClick
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          className={disabledActionClassName}
          disabled={disabled}
          onClick={onClick}
          type="button"
          variant="outline"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
