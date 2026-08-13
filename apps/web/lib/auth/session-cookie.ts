export function encodeSessionCookie(input: { sessionId: string }) {
  return input.sessionId;
}

export function decodeSessionCookie(cookieValue?: string | null) {
  if (!cookieValue) {
    return null;
  }

  const sessionId = cookieValue.trim();
  if (!isUuidLike(sessionId)) {
    return null;
  }

  return { sessionId };
}

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
