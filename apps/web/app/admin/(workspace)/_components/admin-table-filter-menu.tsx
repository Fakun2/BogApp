"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ListFilter, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AdminTableHeaderActionButton } from "./admin-table-header-action-button";

export type AdminTableFilterOption = {
  active?: boolean;
  checked?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  label: string;
  multiple?: boolean;
  valueLabel?: string;
  onCheckedChange?: (checked: boolean) => void;
  onSelect?: () => void;
};

export type AdminTableFilterSection = {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  options: AdminTableFilterOption[];
};

export function AdminTableFilterMenu({
  active,
  align = "end",
  className,
  disabled,
  footer,
  label = "Filtros",
  sections
}: {
  active?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  disabled?: boolean;
  footer?: ReactNode;
  label?: string;
  sections: AdminTableFilterSection[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton
          icon={ListFilter}
          label={label}
          disabled={disabled}
          aria-label={`Abrir ${label.toLowerCase()}`}
        >
          {active ? <span className="ml-1 size-2 rounded-full bg-primary" aria-hidden="true" /> : null}
        </AdminTableHeaderActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("w-72 rounded-[20px] p-1.5 shadow-[var(--popup-shadow)]", className)}
        sideOffset={8}
      >
        {sections.map((section) => (
          <DropdownMenuSub key={section.label}>
            <DropdownMenuSubTrigger
              disabled={disabled || section.disabled}
              className="h-10 rounded-xl px-3 text-sm font-medium"
            >
              <section.icon className="size-4" aria-hidden="true" />
              <span>{section.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              alignOffset={-2}
              avoidCollisions={false}
              className="w-64 rounded-[20px] p-1.5"
              sideOffset={8}
            >
              {section.options.map((option) => (
                option.multiple ? (
                  <DropdownMenuCheckboxItem
                    key={`${section.label}:${option.label}`}
                    checked={option.checked}
                    disabled={disabled || section.disabled || option.disabled}
                    onCheckedChange={option.onCheckedChange}
                    onSelect={(event) => event.preventDefault()}
                    className="h-10 rounded-xl px-3 pl-8 text-sm"
                  >
                    {option.icon ? <option.icon className="size-4" aria-hidden="true" /> : null}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </DropdownMenuCheckboxItem>
                ) : (
                  <DropdownMenuItem
                    key={`${section.label}:${option.label}`}
                    disabled={disabled || section.disabled || option.disabled}
                    onSelect={option.onSelect}
                    className="h-10 rounded-xl px-3 text-sm"
                  >
                    {option.icon ? <option.icon className="size-4" aria-hidden="true" /> : null}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {option.valueLabel ? (
                      <span className="max-w-24 truncate text-xs text-muted-foreground">
                        {option.valueLabel}
                      </span>
                    ) : null}
                    {option.active ? <Check className="size-4 text-foreground" aria-hidden="true" /> : null}
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        {footer ? (
          <>
            <DropdownMenuSeparator />
            {footer}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminTableFilterClearItem({
  disabled,
  onClear
}: {
  disabled?: boolean;
  onClear: () => void;
}) {
  return (
    <DropdownMenuItem disabled={disabled} onSelect={onClear} className="h-10 rounded-xl px-3 text-sm">
      <RotateCcw className="size-4" aria-hidden="true" />
      Limpiar filtros
    </DropdownMenuItem>
  );
}
