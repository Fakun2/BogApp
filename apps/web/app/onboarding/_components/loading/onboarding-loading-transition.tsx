"use client";

import { Check, Scale } from "lucide-react";
import { FullscreenLoadingTransition } from "@/components/transitions/fullscreen-loading-transition";
import {
  onboardingLoadingCopy,
  onboardingLoadingDurationMs,
  onboardingLoadingExitMs,
  onboardingLoadingIntroMs,
  onboardingLoadingOverlayStartDelayMs
} from "../../_constants/onboarding.constants";

type OnboardingLoadingTransitionProps = {
  exiting: boolean;
  success: boolean;
  visible: boolean;
};

export function OnboardingLoadingTransition({
  exiting,
  success,
  visible
}: OnboardingLoadingTransitionProps) {
  return (
    <FullscreenLoadingTransition
      active={visible}
      animatedWord={onboardingLoadingCopy.animatedWord}
      coverDuringExit
      durationMs={onboardingLoadingDurationMs}
      exiting={exiting}
      exitDurationMs={onboardingLoadingExitMs}
      footerItems={onboardingLoadingCopy.footerItems}
      icon={<Scale className="h-7 w-7 stroke-[1.35]" />}
      introDurationMs={onboardingLoadingIntroMs}
      overlayStartDelayMs={onboardingLoadingOverlayStartDelayMs}
      subtitle={onboardingLoadingCopy.subtitle}
      success={success}
      successIcon={
        <span className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/8">
          <Check className="h-6 w-6 stroke-[2.2]" />
        </span>
      }
      successTitle={onboardingLoadingCopy.successTitle}
      titlePrefix={onboardingLoadingCopy.titlePrefix}
    />
  );
}
