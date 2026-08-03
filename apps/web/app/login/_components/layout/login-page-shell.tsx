"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginCopy } from "../../_constants/login.constants";
import { LoginCarouselPanel } from "../carousel/login-carousel-panel";
import { LoginCursor } from "../cursor/login-cursor";
import { LoginCursorProvider, useLoginCursor } from "../../_hooks/use-login-cursor";

type LoginPageShellProps = {
  children: ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export function LoginPageShell({ children, darkMode, onToggleTheme }: LoginPageShellProps) {
  return (
    <LoginCursorProvider>
      <LoginPageShellContent darkMode={darkMode} onToggleTheme={onToggleTheme}>
        {children}
      </LoginPageShellContent>
    </LoginCursorProvider>
  );
}

function LoginPageShellContent({ children, darkMode, onToggleTheme }: LoginPageShellProps) {
  const { surfaceHandlers } = useLoginCursor();

  return (
    <main
      className="fixed inset-0 h-[100svh] max-h-[100svh] w-full overflow-hidden bg-background text-foreground transition-colors supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh] lg:cursor-none lg:[&_*]:cursor-none"
      {...surfaceHandlers}
    >
      <div className="grid h-full min-h-0 lg:grid-cols-[1.02fr_1fr]">
        <LoginCarouselPanel />
        <section className="relative flex min-h-0 items-start justify-center overflow-y-auto overscroll-contain px-3 py-14 sm:px-6 sm:py-16 lg:px-12 lg:py-10">
          <div className="absolute left-5 top-5 sm:left-8 sm:top-8 lg:hidden">
            <Button asChild variant="outline" className="size-10 rounded-full p-0">
              <Link href="/" aria-label={loginCopy.goHome}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full px-3"
              onClick={onToggleTheme}
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          {children}
        </section>
      </div>
      <LoginCursor />
    </main>
  );
}
