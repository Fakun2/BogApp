import { Input } from "@/components/ui/input";
import type { OnboardingFormState, UpdateOwner } from "../../_types/onboarding.types";
import { OnboardingField } from "../form/onboarding-field";

type OwnerStepProps = {
  form: OnboardingFormState;
  updateOwner: UpdateOwner;
};

export function OwnerStep({ form, updateOwner }: OwnerStepProps) {
  return (
    <div className="grid gap-4">
      <OnboardingField label="Nombre">
        <Input
          className="h-12 rounded-2xl border-field-border bg-field px-4 text-sm text-field-foreground"
          value={form.owner.fullName}
          onChange={(event) => updateOwner("fullName", event.currentTarget.value)}
        />
      </OnboardingField>
      <OnboardingField label="Email">
        <Input
          type="email"
          className="h-12 rounded-2xl border-field-border bg-field px-4 text-sm text-field-foreground"
          value={form.owner.email}
          onChange={(event) => updateOwner("email", event.currentTarget.value)}
        />
      </OnboardingField>
      <p className="rounded-2xl border border-border bg-secondary/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
        La contraseña se podrá cambiar el panel de administración.
      </p>
    </div>
  );
}
