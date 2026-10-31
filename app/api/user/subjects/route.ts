import { NextResponse } from "next/server";
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
import {
  normalizeAndSerializeUser,
  normalizeSubject,
  sanitizeSubjectName,
} from "@/lib/gradebook-server";
import { isHexColor, pickNextColor } from "@/lib/utils";

export const runtime = "nodejs";

type CreateSubjectBody = {
  name?: string;
  color?: string;
};

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const body = await readJson<CreateSubjectBody>(request);
  const name = sanitizeSubjectName(body?.name);

  if (!name) {
    return jsonError("Naziv predmeta mora imati između 1 i 60 karaktera.");
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

    const duplicate = user.subjects.some(
      (subject) => subject.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      return jsonError("Predmet sa tim nazivom već postoji.", 409);
    }

    if (user.subjects.length >= 60) {
      return jsonError("Dostigao si maksimalan broj predmeta (60).", 400);
    }

    const usedColors = user.subjects
      .map((subject) => subject.color)
      .filter((color): color is string => Boolean(color));
    const color = isHexColor(body?.color) ? (body?.color as string) : pickNextColor(usedColors);

    user.subjects.push({ name, color, grades: [] } as never);
    await user.save();

    const created = user.subjects[user.subjects.length - 1];
    const normalized = normalizeAndSerializeUser(user);

    if (normalized.changed) {
      await user.save();
    }

    const subject = normalized.subjects.find(
      (item) => item.id === String(created._id)
    );

    return NextResponse.json({ subject: subject ?? null }, { status: 201 });
  } catch {
    return jsonServerError();
  }
}
