"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme/theme-provider";

export function ThemeModeSelect() {
  const theme = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-full px-3"
        onClick={theme.toggleVariant}
        aria-label="Cambiar tema"
      >
        {theme.isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
