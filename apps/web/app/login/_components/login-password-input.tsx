"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

type LoginPasswordInputProps = {
  onChange: (value: string) => void;
  value: string;
};

export function LoginPasswordInput({ onChange, value }: LoginPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        autoComplete="current-password"
        className="h-12 rounded-2xl border-border bg-secondary px-4 pr-12 text-sm"
        placeholder="••••••••"
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
