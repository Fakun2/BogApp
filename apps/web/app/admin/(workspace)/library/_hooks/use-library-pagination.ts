"use client";

import { useCallback, useState } from "react";

export function useLibraryPagination() {
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();

  const resetPagination = useCallback(() => {
    setCursor(undefined);
    setCursorStack([]);
  }, []);

  const goToPreviousPage = useCallback(() => {
    const nextStack = [...cursorStack];
    const previous = nextStack.pop();
    setCursor(previous);
    setCursorStack(nextStack);
  }, [cursorStack]);

  const goToNextPage = useCallback((nextCursor: string | null | undefined) => {
    setCursorStack((current) => [...current, cursor ?? ""]);
    setCursor(nextCursor ?? undefined);
  }, [cursor]);

  return {
    canGoBack: cursorStack.length > 0,
    cursor,
    goToNextPage,
    goToPreviousPage,
    resetPagination
  };
}
