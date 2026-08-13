"use client";

import { Check, ChevronDown, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { type ColorMode, useTheme } from "@/lib/theme/theme-provider";
import { cn } from "@/lib/utils";

const themeOptions: Array<{ label: string; value: ColorMode }> = [
  { label: "Navy slate", value: "navy-slate" },
  { label: "Light dark", value: "light-dark" }
];

export function ThemeModeSelect() {
  const theme = useTheme();
  const activeTheme = themeOptions.find((option) => option.value === theme.colorMode);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full px-3 text-xs font-medium sm:text-sm"
            aria-label="Seleccionar tema"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{activeTheme?.label ?? "Theme"}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-40 rounded-xl">
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "px-2.5 py-2 text-sm text-muted-foreground focus:text-foreground",
                option.value === theme.colorMode && "text-foreground"
              )}
              onSelect={() => theme.setColorMode(option.value)}
            >
              <span className="flex size-4 items-center justify-center">
                {option.value === theme.colorMode ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
