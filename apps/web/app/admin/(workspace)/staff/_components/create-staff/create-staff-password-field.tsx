"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateStaffPasswordField({
  error,
  onChange,
  required = false,
  value
}: {
  error?: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="grid gap-2">
      <Label htmlFor="create-worker-password">
        Contraseña
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <div className="relative">
        <Input
          aria-invalid={Boolean(error)}
          autoComplete="new-password"
          id="create-worker-password"
          name="createWorkerPassword"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Contrasena inicial"
          className="h-12 w-full rounded-2xl border-border/40 bg-card px-4 pr-12 shadow-none focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/10"
          type={visible ? "text" : "password"}
          value={value}
        />
        <Button
          type="button"
          variant="outline"
          className="absolute inset-y-1.5 right-1.5 flex h-auto w-9 items-center justify-center rounded-xl border-transparent bg-transparent p-0 text-muted-foreground shadow-none hover:bg-secondary/60 hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
