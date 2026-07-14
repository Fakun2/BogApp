export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "No se pudo completar la solicitud.";
}
