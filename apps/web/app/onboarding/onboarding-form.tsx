"use client";

import { ArrowRight, ChevronLeft, Loader2, Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme/theme-provider";
import { AnimatedStep } from "./_components/shared/animated-step";
import { OnboardingLoadingTransition } from "./_components/loading/onboarding-loading-transition";
import { OnboardingVisual } from "./_components/visual/onboarding-visual";
import { OwnerStep } from "./_components/steps/owner-step";
import { SuccessState } from "./_components/visual/success-state";
import { TenantStep } from "./_components/steps/tenant-step";
import { WorkspaceStep } from "./_components/steps/workspace-step";
import { useOnboardingFlow } from "./_hooks/use-onboarding-flow";
import type { StepIndex } from "./_types/onboarding.types";

export function OnboardingForm() {
  const onboarding = useOnboardingFlow();
  const theme = useTheme();

  if (!onboarding.sessionReady) {
    return (
      <main className="flex h-[100svh] items-center justify-center bg-background text-foreground supports-[height:100dvh]:h-[100dvh]">
        <Loader2 className="h-5 w-5 animate-spin" />
      </main>
    );
  }

  return (
    <>
      <main className="fixed inset-0 h-[100svh] max-h-[100svh] w-full overflow-hidden bg-background p-3 text-foreground transition-colors supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh] md:p-5">
        <div className="grid h-full min-h-0 overflow-hidden rounded-2xl lg:grid-cols-[minmax(280px,0.3fr)_minmax(0,0.7fr)]">
          <OnboardingVisual
            currentStep={onboarding.step}
            progress={onboarding.progress}
            setStep={onboarding.goToStep}
            submitting={onboarding.submitting}
          />

          <section className="relative flex min-h-0 items-start justify-center overflow-y-auto overscroll-contain bg-transparent px-4 py-14 text-foreground shadow-none sm:px-5 sm:py-16 md:px-8 lg:py-10 dark:text-[var(--onboarding-panel-foreground)] dark:[--border:var(--onboarding-panel-border)] dark:[--field-border:var(--onboarding-panel-border)] dark:[--field-foreground:var(--onboarding-panel-surface-foreground)] dark:[--field:var(--onboarding-panel-surface)]">
            <div className="absolute right-5 top-5">
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

            <div className="my-auto w-full max-w-[560px]">
              <div className="mb-6 md:mb-8">
                <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
                  {onboarding.currentStep.eyebrow}
                </Badge>
                <h1 className="text-balance text-2xl font-semibold leading-tight tracking-normal sm:text-3xl md:text-[34px]">
                  {onboarding.currentStep.title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {onboarding.currentStep.description}
                </p>
              </div>

              {onboarding.result ? (
                <SuccessState result={onboarding.result} />
              ) : (
                <form className="grid gap-5" onSubmit={onboarding.submit}>
                  <AnimatedStep step={onboarding.step}>
                    {onboarding.step === 0 ? (
                      <OwnerStep form={onboarding.form} updateOwner={onboarding.updateOwner} />
                    ) : null}
                    {onboarding.step === 1 ? (
                      <TenantStep
                        darkMode={theme.isDark}
                        form={onboarding.form}
                        updateTenant={onboarding.updateTenant}
                      />
                    ) : null}
                    {onboarding.step === 2 ? (
                      <WorkspaceStep
                        form={onboarding.form}
                        practiceAreasEnabled={onboarding.practiceAreasEnabled}
                        practiceAreaTemplates={onboarding.practiceAreaTemplates}
                        practiceAreaTemplatesError={onboarding.practiceAreaTemplatesError}
                        practiceAreaTemplatesLoading={onboarding.practiceAreaTemplatesLoading}
                        setPracticeAreasEnabled={onboarding.setPracticeAreasEnabled}
                        togglePracticeArea={onboarding.togglePracticeArea}
                      />
                    ) : null}
                  </AnimatedStep>

                  {onboarding.stepError ? (
                    <p className="rounded-2xl border border-border bg-secondary px-4 py-3 text-sm">
                      {onboarding.stepError}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-2xl"
                      disabled={onboarding.step === 0 || onboarding.submitting}
                      onClick={() =>
                        onboarding.goToStep(Math.max(onboarding.step - 1, 0) as StepIndex)
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Atras
                    </Button>

                    {onboarding.step < 2 ? (
                      <Button
                        type="button"
                        className="h-11 rounded-2xl"
                        onClick={onboarding.goNext}
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : null}
                    {onboarding.step === 2 ? (
                      <Button
                        type="button"
                        className="h-11 rounded-2xl"
                        disabled={onboarding.submitting}
                        onClick={onboarding.completeOnboarding}
                      >
                        {onboarding.submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        Crear estudio
                        {!onboarding.submitting ? <ArrowRight className="h-4 w-4" /> : null}
                      </Button>
                    ) : null}
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <OnboardingLoadingTransition
        exiting={onboarding.transitionExiting}
        success={onboarding.transitionSuccess}
        visible={onboarding.submitting}
      />
    </>
  );
}
