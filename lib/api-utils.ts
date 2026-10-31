import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function jsonServerError(): NextResponse {
  return NextResponse.json({ error: "Došlo je do greške na serveru. Pokušaj ponovo." }, { status: 500 });
}

export function jsonDatabaseError(): NextResponse {
  return NextResponse.json(
    { error: "Baza trenutno nije dostupna. Pokušaj ponovo za koji trenutak." },
    { status: 503 }
  );
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === request.headers.get("host");
  } catch {
    return false;
  }
}
