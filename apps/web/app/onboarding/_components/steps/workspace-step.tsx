import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { OnboardingFormState, PracticeAreaTemplate } from "../../_types/onboarding.types";
import { OnboardingField } from "../form/onboarding-field";

type WorkspaceStepProps = {
  form: OnboardingFormState;
  practiceAreasEnabled: boolean;
  practiceAreaTemplates: PracticeAreaTemplate[];
  practiceAreaTemplatesError: string | null;
  practiceAreaTemplatesLoading: boolean;
  setPracticeAreasEnabled: (enabled: boolean) => void;
  togglePracticeArea: (code: string) => void;
};

export function WorkspaceStep({
  form,
  practiceAreasEnabled,
  practiceAreaTemplates,
  practiceAreaTemplatesError,
  practiceAreaTemplatesLoading,
  setPracticeAreasEnabled,
  togglePracticeArea
}: WorkspaceStepProps) {
  return (
    <div className="mx-auto grid max-w-[460px] gap-4">
      <OnboardingField label="Areas de practica iniciales">
        <div className="grid gap-4">
          <label className="flex min-h-11 w-fit items-center gap-3 rounded-2xl border border-field-border bg-field px-4 py-2.5 text-sm font-medium text-field-foreground">
            <Checkbox
              checked={practiceAreasEnabled}
              className="size-4 rounded-[5px] border-field-border bg-field text-field-foreground data-[state=checked]:border-[var(--workspace-pill-selected)] data-[state=checked]:bg-[var(--workspace-pill-selected)] data-[state=checked]:text-[var(--workspace-pill-selected-foreground)]"
              onCheckedChange={(checked) => setPracticeAreasEnabled(checked === true)}
            />
            Activar areas de practica
          </label>

          {practiceAreasEnabled ? (
            <div className="flex flex-wrap gap-2.5">
              {practiceAreaTemplates.map((area) => {
                const selected = form.workspace.practiceAreaCodes.includes(area.code);

                return (
                  <button
                    key={area.code}
                    type="button"
                    className={cn(
                      "min-h-10 rounded-full border px-4 py-2 text-left text-sm font-medium leading-5 transition-colors",
                      selected
                        ? "border-[var(--workspace-pill-selected)] bg-[var(--workspace-pill-selected)] text-[var(--workspace-pill-selected-foreground)]"
                        : "border-field-border bg-field text-field-foreground hover:bg-card"
                    )}
                    onClick={() => togglePracticeArea(area.code)}
                    aria-pressed={selected}
                  >
                    {area.name}
                  </button>
                );
              })}
            </div>
          ) : null}

          {practiceAreasEnabled && practiceAreaTemplatesLoading ? (
            <p className="text-xs text-muted-foreground">Cargando areas reutilizables...</p>
          ) : null}

          {practiceAreasEnabled && practiceAreaTemplatesError ? (
            <p className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              {practiceAreaTemplatesError}
            </p>
          ) : null}
        </div>
      </OnboardingField>
      <p className="rounded-xl border border-border bg-secondary/70 px-3 py-2 text-xs leading-5 text-muted-foreground">
        Dentro del panel vas a poder crear areas de practica propias segun la forma de trabajo del
        estudio.
      </p>
    </div>
  );
}
