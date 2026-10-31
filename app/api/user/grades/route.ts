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
  sanitizeGradeInputs,
} from "@/lib/gradebook-server";

export const runtime = "nodejs";

type GradesBody = {
  subjectId?: string;
  grades?: unknown;
};

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const body = await readJson<GradesBody>(request);
  const subjectId = String(body?.subjectId || "");

  if (!subjectId) {
    return jsonError("Nedostaje ID predmeta.");
  }

  const grades = sanitizeGradeInputs(body?.grades);
  if (grades === null) {
    return jsonError("Ocene nisu ispravno poslate.");
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

    const subject = user.subjects.find((item) => String(item._id) === subjectId);
    if (!subject) {
      return jsonError("Predmet nije pronađen.", 404);
    }

    subject.grades = grades as unknown[];
    subject.markModified?.("grades");
    await user.save();

    const normalized = normalizeAndSerializeUser(user);
    if (normalized.changed) {
      await user.save();
    }

    const updated = normalized.subjects.find((item) => item.id === subjectId);

    return NextResponse.json({ subject: updated ?? null });
  } catch {
    return jsonServerError();
  }
}
