"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { caseNativeDateTimeInputClassName } from "../../_constants/cases.constants";

type CaseDateInputProps = Omit<ComponentProps<typeof Input>, "type">;

export function CaseDateInput({
  className,
  placeholder = "AAAA-MM-DD",
  ...props
}: CaseDateInputProps) {
  return (
    <Input
      className={cn(caseNativeDateTimeInputClassName, className)}
      placeholder={placeholder}
      type="date"
      {...props}
    />
  );
}
