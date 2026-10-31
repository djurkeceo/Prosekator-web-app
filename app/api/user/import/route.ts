import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
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
  sanitizeSubjectName,
} from "@/lib/gradebook-server";
import { isHexColor, pickNextColor } from "@/lib/utils";
import type { Grade } from "@/lib/types";

export const runtime = "nodejs";

type ImportSubject = {
  name?: unknown;
  color?: unknown;
  grades?: unknown;
};

type ImportBody = {
  subjects?: ImportSubject[];
};

type PreparedSubject = {
  name: string;
  grades: Grade[];
  color: string | null;
};

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const body = await readJson<ImportBody>(request);
  if (!Array.isArray(body?.subjects) || body.subjects.length === 0) {
    return jsonError("Nema podataka za prenos.");
  }

  if (body.subjects.length > 100) {
    return jsonError("Previše predmeta za prenos.");
  }

  const prepared = body.subjects
    .map((item): PreparedSubject | null => {
      const name = sanitizeSubjectName(item?.name);
      const grades = sanitizeGradeInputs(item?.grades ?? []) ?? [];
      const color = isHexColor(item?.color) ? (item?.color as string) : null;
      return name ? { name, grades, color } : null;
    })
    .filter((item): item is PreparedSubject => Boolean(item));

  if (!prepared.length) {
    return jsonError("Nijedan predmet nije ispravan.");
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

    const normalizedExisting = normalizeAndSerializeUser(user);
    if (normalizedExisting.changed) {
      await user.save();
    }

    const existingGradeIds = new Set<string>();
    for (const subject of user.subjects) {
      for (const grade of subject.grades) {
        if (grade && typeof grade === "object" && typeof (grade as { id?: unknown }).id === "string") {
          existingGradeIds.add((grade as { id: string }).id);
        }
      }
    }

    for (const item of prepared) {
      const grades = item.grades.map((grade) => {
        if (existingGradeIds.has(grade.id)) {
          return { ...grade, id: randomUUID() };
        }
        existingGradeIds.add(grade.id);
        return grade;
      });

      const existing = user.subjects.find(
        (subject) => subject.name.trim().toLowerCase() === item.name.toLowerCase()
      );

      if (existing) {
        existing.grades = [...existing.grades, ...grades] as unknown[];
        existing.markModified?.("grades");
      } else {
        const usedColors = user.subjects
          .map((subject) => subject.color)
          .filter((color): color is string => Boolean(color));

        user.subjects.push({
          name: item.name,
          color: item.color ?? pickNextColor(usedColors),
          grades,
        } as never);
      }
    }

    await user.save();

    const normalized = normalizeAndSerializeUser(user);
    if (normalized.changed) {
      await user.save();
    }

    return NextResponse.json({
      user: normalized.user,
      subjects: normalized.subjects,
    });
  } catch {
    return jsonServerError();
  }
}
