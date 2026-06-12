"use client";

import { type CSSProperties, type ReactNode, useId } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useFullscreenLoadingTransition } from "./_hooks/use-fullscreen-loading-transition";

type FullscreenLoadingTransitionProps = {
  active: boolean;
  animatedWord?: string;
  brand?: string;
  className?: string;
  coverDuringExit?: boolean;
  durationMs?: number;
  exiting?: boolean;
  exitDurationMs?: number;
  footerItems?: readonly string[];
  icon?: ReactNode;
  introDurationMs?: number;
  onExited?: () => void;
  overlayStartDelayMs?: number;
  success?: boolean;
  successIcon?: ReactNode;
  successSubtitle?: string;
  successTitle?: string;
  subtitle?: string;
  titlePrefix: string;
};

export function FullscreenLoadingTransition({
  active,
  animatedWord = "espere",
  brand,
  className,
  coverDuringExit = false,
  durationMs = 3000,
  exiting = false,
  exitDurationMs = 900,
  footerItems = [],
  icon,
  introDurationMs = 900,
  onExited,
  overlayStartDelayMs = 80,
  success = false,
  successIcon,
  successSubtitle,
  successTitle,
  subtitle,
  titlePrefix
}: FullscreenLoadingTransitionProps) {
  const titleId = useId();
  const { contentVisible, ellipsis, mounted, overlayCovered, progressing } =
    useFullscreenLoadingTransition({
      active,
      coverDuringExit,
      exiting,
      exitDurationMs,
      introDurationMs,
      onExited,
      overlayStartDelayMs,
      success
    });

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-live="polite"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/[0.94] px-6 text-white transition-[opacity,backdrop-filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
        overlayCovered && (!exiting || coverDuringExit)
          ? "opacity-100 backdrop-blur-[14px]"
          : "opacity-0 backdrop-blur-0",
        className
      )}
      style={{ transitionDuration: `${exiting ? exitDurationMs : introDurationMs}ms` }}
      role="dialog"
    >
      <div
        className={cn(
          "grid w-full max-w-[420px] gap-7 text-center transition-[opacity,transform] duration-700 ease-out",
          contentVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        )}
      >
        <div className="grid justify-items-center gap-5">
          {success && successIcon ? (
            <div className="text-white">{successIcon}</div>
          ) : icon ? (
            <div className="text-white/78">{icon}</div>
          ) : null}

          <div className="grid gap-2">
            {brand && !success ? (
              <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-white/36">
                {brand}
              </p>
            ) : null}

            <h2
              id={titleId}
              className="text-balance text-[clamp(1.45rem,2.6vw,2.05rem)] font-semibold leading-tight tracking-normal text-white/82"
            >
              {success && successTitle ? (
                successTitle
              ) : (
                <>
                  {titlePrefix}
                  <span className="inline-block min-w-[5.1ch] text-left">
                    {animatedWord}
                    {ellipsis}
                  </span>
                </>
              )}
            </h2>

            {success && successSubtitle ? (
              <p className="text-sm font-medium leading-6 text-white/36">{successSubtitle}</p>
            ) : subtitle ? (
              <p className="text-sm font-medium leading-6 text-white/36">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {!success ? (
          <Progress
            className="mx-auto h-1.5 w-full max-w-[292px] bg-white/18 [&_[data-slot=progress-indicator]]:bg-[#62f15c] [&_[data-slot=progress-indicator]]:shadow-[0_0_22px_rgba(98,241,92,0.5)]"
            value={progressing ? 100 : 0}
            style={{ "--progress-duration": `${durationMs}ms` } as CSSProperties}
          />
        ) : null}
      </div>

      {footerItems.length > 0 && !success ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-[8.5vh] grid justify-items-center gap-2 text-[11px] font-medium text-white/16 transition-opacity duration-500 ease-out",
            contentVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {footerItems.map((item, index) => (
            <p
              key={item}
              className={cn(index === 0 && "text-white/42")}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {item}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
