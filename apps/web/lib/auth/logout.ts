"use client";

export const logoutRedirectPath = "/login?logout=1";

export function redirectToLoginForLogout(router: { replace: (href: string) => void }) {
  router.replace(logoutRedirectPath);
}
