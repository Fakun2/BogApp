"use client";

import { useState } from "react";
import { CreateAccountMedia } from "./_components/create-account-media";
import { CreateAccountPageShell } from "./_components/create-account-page-shell";
import { CreateAccountPanel } from "./_components/create-account-panel";
import { CreateAccountCursorProvider } from "./_hooks/use-create-account-cursor";
import { useCreateAccountForm } from "./_hooks/use-create-account-form";

export default function CreateAccountPage() {
  const [darkMode, setDarkMode] = useState(true);
  const formState = useCreateAccountForm();

  return (
    <CreateAccountCursorProvider submitting={formState.submitting}>
      <CreateAccountPageShell
        darkMode={darkMode}
        submitting={formState.submitting}
        transitionExiting={formState.transitionExiting}
        transitionSuccess={formState.transitionSuccess}
      >
        <div className="mx-auto grid min-h-screen w-full gap-3 lg:h-full lg:min-h-0 lg:max-w-[1800px] lg:grid-cols-[530px_1fr]">
          <CreateAccountPanel
            darkMode={darkMode}
            formState={formState}
            onToggleTheme={() => setDarkMode((current) => !current)}
          />
          <CreateAccountMedia />
        </div>
      </CreateAccountPageShell>
    </CreateAccountCursorProvider>
  );
}
