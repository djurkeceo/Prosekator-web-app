import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import {
  assertSameOrigin,
  jsonDatabaseError,
  jsonError,
  jsonServerError,
  readJson,
} from "@/lib/api-utils";
import { getSessionUserId } from "@/lib/session";
import { toPublicUser } from "@/lib/gradebook-server";
import {
  isPasswordStrong,
  isValidPersonName,
  normalizePersonName,
} from "@/lib/validation";

export const runtime = "nodejs";

type UpdateBody = {
  name?: string;
  password?: string;
  currentPassword?: string;
};

export async function PATCH(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const body = await readJson<UpdateBody>(request);
  const name = body?.name === undefined ? undefined : normalizePersonName(body.name);
  const password = body?.password === undefined ? undefined : String(body.password);
  const currentPassword =
    body?.currentPassword === undefined ? undefined : String(body.currentPassword);

  if (name === undefined && password === undefined) {
    return jsonError("Nema izmena za čuvanje.");
  }

  if (name !== undefined && !isValidPersonName(name)) {
    return jsonError("Ime mora imati između 2 i 60 karaktera.");
  }

  if (password !== undefined && !isPasswordStrong(password)) {
    return jsonError("Lozinka mora imati najmanje 8 karaktera, veliko slovo i broj.");
  }

  if (password !== undefined && !currentPassword) {
    return jsonError("Unesi trenutnu lozinku.");
  }

  try {
    await connectDB();
  } catch {
    return jsonDatabaseError();
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return jsonError("Nalog nije pronađen.", 404);
    }

    if (name !== undefined) user.name = name;

    if (password !== undefined) {
      const currentMatches = await compare(currentPassword || "", user.password);
      if (!currentMatches) {
        return jsonError("Trenutna lozinka nije ispravna.", 401);
      }

      user.password = await hash(password, 12);
    }

    await user.save();

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return jsonServerError();
  }
}
