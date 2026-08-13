"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const loginArrivalRevealMs = 1100;

export function useLoginArrivalReveal() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const shouldReveal = searchParams.get("loading") === "account-created";
  const [revealing, setRevealing] = useState(true);

  useEffect(() => {
    setRevealing(true);

    const timeout = window.setTimeout(() => {
      setRevealing(false);
      if (shouldReveal) {
        removeLoadingParam();
      }
    }, loginArrivalRevealMs);

    return () => window.clearTimeout(timeout);
  }, [shouldReveal]);

  return {
    email,
    firstLogin: shouldReveal,
    revealing
  };
}

function removeLoadingParam() {
  const nextSearchParams = new URLSearchParams(window.location.search);
  nextSearchParams.delete("loading");
  const nextSearch = nextSearchParams.toString();

  window.history.replaceState(
    null,
    "",
    nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname
  );
}
