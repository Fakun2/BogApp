"use client";

import { useEffect, useState } from "react";
import { readSession, subscribeSession } from "./session";

export function useSession() {
  const [session, setSession] = useState(() => readSession());

  useEffect(() => {
    return subscribeSession(() => setSession(readSession()));
  }, []);

  return session;
}
