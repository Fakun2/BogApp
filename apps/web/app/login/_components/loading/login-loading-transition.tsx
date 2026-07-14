"use client";

import { Check, Scale } from "lucide-react";
import { FullscreenLoadingTransition } from "@/components/transitions/fullscreen-loading-transition";
import {
  loginLoadingCopy,
  loginLoadingDurationMs,
  loginLoadingExitMs,
  loginLoadingIntroMs,
  loginLoadingOverlayStartDelayMs
} from "../../_constants/login.constants";

type LoginLoadingTransitionProps = {
  exiting: boolean;
  success: boolean;
  visible: boolean;
};

export function LoginLoadingTransition({ exiting, success, visible }: LoginLoadingTransitionProps) {
  return (
    <FullscreenLoadingTransition
      active={visible}
      animatedWord={loginLoadingCopy.animatedWord}
      coverDuringExit
      durationMs={loginLoadingDurationMs}
      exiting={exiting}
      exitDurationMs={loginLoadingExitMs}
      footerItems={loginLoadingCopy.footerItems}
      icon={<Scale className="h-7 w-7 stroke-[1.35]" />}
      introDurationMs={loginLoadingIntroMs}
      overlayStartDelayMs={loginLoadingOverlayStartDelayMs}
      subtitle={loginLoadingCopy.subtitle}
      success={success}
      successIcon={
        <span className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/8">
          <Check className="h-6 w-6 stroke-[2.2]" />
        </span>
      }
      successTitle={loginLoadingCopy.successTitle}
      titlePrefix={loginLoadingCopy.titlePrefix}
    />
  );
}
