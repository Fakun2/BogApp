import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type OnboardingFieldProps = {
  children: ReactNode;
  label: string;
};

export function OnboardingField({ children, label }: OnboardingFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
