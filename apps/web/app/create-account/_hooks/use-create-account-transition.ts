"use client";

import { useState } from "react";

export function useCreateAccountTransition() {
  const [exiting, setExiting] = useState(false);
  const [success, setSuccess] = useState(false);

  function start() {
    setExiting(false);
    setSuccess(false);
  }

  function showSuccess() {
    setSuccess(true);
  }

  function exit() {
    setExiting(true);
  }

  function reset() {
    setExiting(false);
    setSuccess(false);
  }

  return {
    exit,
    exiting,
    reset,
    showSuccess,
    start,
    success
  };
}
