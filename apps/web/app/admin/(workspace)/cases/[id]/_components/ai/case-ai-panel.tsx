"use client";

import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import type { CaseDetailDto } from "../../../_types/cases.types";

export function CaseAiPanel({
  canUseAi,
  caseItem
}: {
  canUseAi: boolean;
  caseItem: CaseDetailDto;
}) {
  const label = canUseAi
    ? `Asistencia IA para expediente ${caseItem.caseNumber}. Soon.`
    : "Asistencia IA no disponible para tu rol. Soon.";

  return (
    <TooltipProvider>
      <div className="fixed bottom-5 right-5 z-40 md:bottom-6 md:right-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-disabled="true"
              aria-label={label}
              className="relative h-14 w-14 rounded-full border-blue-500/25 bg-blue-600 p-0 text-white shadow-[0_16px_36px_rgba(37,99,235,0.28)] hover:bg-blue-600"
              type="button"
            >
              <Bot className="h-6 w-6" aria-hidden="true" />
              <Badge
                className="pointer-events-none absolute -right-2 -top-2 h-5 rounded-full border-blue-500/30 bg-background px-2 text-[10px] font-semibold uppercase leading-none text-blue-700 shadow-sm dark:text-blue-300"
                variant="outline"
              >
                Soon
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{label}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
