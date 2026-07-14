"use client";

import { Suspense } from "react";
import { RouteRevealTransition } from "@/components/transitions/route-reveal-transition";
import { useTheme } from "@/lib/theme/theme-provider";
import { LoginForm } from "./_components/form/login-form";
import { LoginPageShell } from "./_components/layout/login-page-shell";
import { loginArrivalRevealMs, useLoginArrivalReveal } from "./_hooks/use-login-arrival-reveal";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const theme = useTheme();
  const arrival = useLoginArrivalReveal();

  return (
    <LoginPageShell darkMode={theme.isDark} onToggleTheme={theme.toggleVariant}>
      <LoginForm firstLogin={arrival.firstLogin} initialEmail={arrival.email} />
      <RouteRevealTransition active={arrival.revealing} durationMs={loginArrivalRevealMs} />
    </LoginPageShell>
  );
}
