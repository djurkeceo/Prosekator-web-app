import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import {
  assertSameOrigin,
  getClientIp,
  jsonDatabaseError,
  jsonError,
  jsonServerError,
  readJson,
} from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { applySessionCookie, createSessionToken } from "@/lib/session";
import { toPublicUser } from "@/lib/gradebook-server";
import { isEmailValid } from "@/lib/validation";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const limit = rateLimit(`login:${getClientIp(request)}`, 12, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Previše pokušaja prijave. Sačekaj nekoliko minuta." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await readJson<LoginBody>(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return jsonError("Unesi email i lozinku.");
  }

  if (!isEmailValid(email)) {
    return jsonError("Email adresa nije ispravna.");
  }

  try {
    await connectDB();
  } catch {
    return jsonDatabaseError();
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return jsonError("Pogrešan email ili lozinka.", 401);
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return jsonError("Pogrešan email ili lozinka.", 401);
    }

    const token = await createSessionToken(String(user._id));
    const response = NextResponse.json({ user: toPublicUser(user) });
    applySessionCookie(response, token);
    return response;
  } catch {
    return jsonServerError();
  }
}
