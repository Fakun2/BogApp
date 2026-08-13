"use client";

import { AlertCircle, LockKeyhole, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseAiStatus } from "./case-ai-types";

type CaseAiStateProps = {
  onRetry?: () => void;
  status: Exclude<CaseAiStatus, "idle">;
};

export function CaseAiState({ onRetry, status }: CaseAiStateProps) {
  const state = {
    error: {
      icon: AlertCircle,
      title: "No se pudo generar la respuesta.",
      description: "El motor de IA no esta disponible en este momento."
    },
    loading: {
      icon: Loader2,
      title: "Analizando expediente.",
      description: "Preparando una respuesta asistida con el contexto permitido."
    },
    "no-context": {
      icon: SearchX,
      title: "No hay contexto suficiente.",
      description: "El asistente necesita un expediente cargado para responder."
    },
    "no-permission": {
      icon: LockKeyhole,
      title: "No tenes permisos para usar IA en este expediente.",
      description: "El acceso al asistente se habilita desde permisos especificos de IA."
    }
  }[status];
  const Icon = state.icon;

  return (
    <div className="rounded-lg border border-dashed border-border bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
          <Icon
            className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{state.title}</p>
          <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
            {state.description}
          </p>
        </div>
        {status === "error" ? (
          <Button className="h-8 shrink-0 px-3" onClick={onRetry} type="button" variant="outline">
            Reintentar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
