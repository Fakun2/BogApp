"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  ListTodo,
  Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseAiSource, CaseAiSourceType } from "./case-ai-types";

const sourceIconByType: Record<CaseAiSourceType, typeof FileText> = {
  case: BriefcaseBusiness,
  document: FileText,
  expense: Receipt,
  hearing: CalendarClock,
  legal: BookOpen,
  task: ListTodo
};

export function CaseAiSources({ sources }: { sources: CaseAiSource[] }) {
  if (!sources.length) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground">Fuentes</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {sources.map((source) => {
          const Icon = sourceIconByType[source.type];

          return (
            <div
              className="min-w-0 rounded-md border border-border/70 bg-background/70 p-3"
              key={source.id}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <p className="min-w-0 truncate text-xs font-semibold text-foreground">
                  {source.label}
                </p>
              </div>
              <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">
                {source.detail}
              </p>
              <Badge className="mt-2" variant="outline">
                {source.type}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
