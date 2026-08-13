import type { NextFunction, Request, Response } from "express";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const clients = new Map<string, RateLimitEntry>();

export function createGlobalRateLimitMiddleware() {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX ?? 60);

  return function globalRateLimit(request: Request, response: Response, next: NextFunction) {
    const now = Date.now();
    const key = getClientKey(request);
    const current = clients.get(key);
    const entry =
      current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    clients.set(key, entry);

    const remaining = Math.max(maxRequests - entry.count, 0);
    response.setHeader("RateLimit-Limit", String(maxRequests));
    response.setHeader("RateLimit-Remaining", String(remaining));
    response.setHeader("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > maxRequests) {
      response.status(429).json({
        statusCode: 429,
        message: "Too many requests"
      });
      return;
    }

    cleanupExpiredClients(now);
    next();
  };
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const fallbackIp = request.ip ?? request.socket.remoteAddress ?? "unknown";

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() || fallbackIp;
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0];
  }

  return fallbackIp;
}

function cleanupExpiredClients(now: number) {
  if (clients.size < 1_000) {
    return;
  }

  for (const [key, entry] of clients.entries()) {
    if (entry.resetAt <= now) {
      clients.delete(key);
    }
  }
}
