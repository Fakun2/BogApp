"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RouteRevealTransition } from "@/components/transitions/route-reveal-transition";
import { clearSession } from "@/lib/auth/session";
import { useTheme } from "@/lib/theme/theme-provider";
import { LoginForm } from "./_components/form/login-form";
import { LoginPageShell } from "./_components/layout/login-page-shell";
import { loginArrivalRevealMs, useLoginArrivalReveal } from "./_hooks/use-login-arrival-reveal";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="h-[100svh] bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const theme = useTheme();
  const arrival = useLoginArrivalReveal();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("logout") !== "1") {
      return;
    }

    let cancelled = false;

    async function clearLogoutState() {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
      clearSession();

      if (!cancelled) {
        router.replace("/login");
      }
    }

    void clearLogoutState();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <LoginPageShell darkMode={theme.isDark} onToggleTheme={theme.toggleVariant}>
      <LoginForm firstLogin={arrival.firstLogin} initialEmail={arrival.email} />
      <RouteRevealTransition active={arrival.revealing} durationMs={loginArrivalRevealMs} />
    </LoginPageShell>
  );
}
