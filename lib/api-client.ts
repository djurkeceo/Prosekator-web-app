export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Nema veze sa serverom. Proveri internet konekciju.", 0);
  }

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;

  if (!response.ok) {
    throw new ApiError(data?.error || "Zahtev nije uspeo. Pokušaj ponovo.", response.status);
  }

  return data;
}

export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Došlo je do neočekivane greške.";
}
