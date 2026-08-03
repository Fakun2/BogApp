export function getApiProxyOrigin() {
  return process.env.NEXT_PUBLIC_API_PROXY_ORIGIN ?? "http://localhost:3001";
}

export function toApiUrl(path: string) {
  return `${getApiProxyOrigin()}${path.startsWith("/api") ? path : `/api${path}`}`;
}
