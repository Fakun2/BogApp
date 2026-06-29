"use client";

import { Check, Scale } from "lucide-react";
import { FullscreenLoadingTransition } from "@/components/transitions/fullscreen-loading-transition";
import {
  createAccountLoadingCopy,
  createAccountLoadingDurationMs,
  createAccountLoadingExitMs,
  createAccountLoadingIntroMs,
  createAccountLoadingOverlayStartDelayMs
} from "../_constants/create-account.constants";

type CreateAccountLoadingDialogProps = {
  exiting: boolean;
  success: boolean;
  visible: boolean;
};

export function CreateAccountLoadingDialog({
  exiting,
  success,
  visible
}: CreateAccountLoadingDialogProps) {
  return (
    <FullscreenLoadingTransition
      active={visible}
      animatedWord={createAccountLoadingCopy.animatedWord}
      coverDuringExit
      durationMs={createAccountLoadingDurationMs}
      exiting={exiting}
      exitDurationMs={createAccountLoadingExitMs}
      footerItems={createAccountLoadingCopy.footerItems}
      icon={<Scale className="h-7 w-7 stroke-[1.35]" />}
      introDurationMs={createAccountLoadingIntroMs}
      overlayStartDelayMs={createAccountLoadingOverlayStartDelayMs}
      subtitle={createAccountLoadingCopy.subtitle}
      success={success}
      successIcon={
        <span className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/8">
          <Check className="h-6 w-6 stroke-[2.2]" />
        </span>
      }
      successTitle={createAccountLoadingCopy.successTitle}
      titlePrefix={createAccountLoadingCopy.titlePrefix}
    />
  );
}
