import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
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
import {
  isEmailValid,
  isPasswordStrong,
  isValidPersonName,
  normalizePersonName,
} from "@/lib/validation";

export const runtime = "nodejs";

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const limit = rateLimit(`signup:${getClientIp(request)}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Previše kreiranih naloga sa ove adrese. Pokušaj kasnije." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await readJson<SignupBody>(request);
  const name = normalizePersonName(String(body?.name || ""));
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!name || !email || !password) {
    return jsonError("Popuni sva obavezna polja.");
  }

  if (!isValidPersonName(name)) {
    return jsonError("Ime mora imati između 2 i 60 karaktera.");
  }

  if (!isEmailValid(email)) {
    return jsonError("Email adresa nije ispravna.");
  }

  if (!isPasswordStrong(password)) {
    return jsonError("Lozinka mora imati najmanje 8 karaktera, veliko slovo i broj.");
  }

  try {
    await connectDB();
  } catch {
    return jsonDatabaseError();
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return jsonError("Nalog sa ovom email adresom već postoji.", 409);
    }

    const hashedPassword = await hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      subjects: [],
    });

    const token = await createSessionToken(String(user._id));
    const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
    applySessionCookie(response, token);
    return response;
  } catch {
    return jsonServerError();
  }
}
