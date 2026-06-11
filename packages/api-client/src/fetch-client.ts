type RequestConfig = {
  url: string;
  method: string;
  headers?: HeadersInit;
  data?: unknown;
  params?: Record<string, unknown>;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/api";

export async function bogaapFetch<T>({
  url,
  method,
  headers,
  data,
  params
}: RequestConfig): Promise<T> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  const response = await fetch(`${apiBaseUrl}${url}${query ? `?${query}` : ""}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: data === undefined ? undefined : JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`BOGAP API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
