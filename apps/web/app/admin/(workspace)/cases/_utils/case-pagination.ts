export function parseCursorStack(value?: string) {
  return (value ?? "").split(",").filter(Boolean);
}

export function getCurrentCursor(cursorStack: string[]) {
  return cursorStack.at(-1);
}

export function appendCursor(cursorStack: string[], cursor: string) {
  return [...cursorStack, cursor];
}

export function removeLastCursor(cursorStack: string[]) {
  return cursorStack.slice(0, -1);
}

export function serializeCursorStack(cursorStack: string[]) {
  return cursorStack.join(",");
}
