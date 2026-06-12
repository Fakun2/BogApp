"use client";

import { Suspense, useState } from "react";
import { RouteRevealTransition } from "@/components/transitions/route-reveal-transition";
import { LoginForm } from "./_components/login-form";
import { LoginPageShell } from "./_components/login-page-shell";
import { loginArrivalRevealMs, useLoginArrivalReveal } from "./_hooks/use-login-arrival-reveal";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const [darkMode, setDarkMode] = useState(true);
  const arrival = useLoginArrivalReveal();

  return (
    <LoginPageShell darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)}>
      <LoginForm firstLogin={arrival.firstLogin} initialEmail={arrival.email} />
      <RouteRevealTransition active={arrival.revealing} durationMs={loginArrivalRevealMs} />
    </LoginPageShell>
  );
}
