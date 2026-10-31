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
  sanitizeSubjectName,
} from "@/lib/gradebook-server";
import { isHexColor } from "@/lib/utils";

export const runtime = "nodejs";

type UpdateSubjectBody = {
  name?: string;
  color?: string;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const { id } = await context.params;
  const body = await readJson<UpdateSubjectBody>(request);
  const name = body?.name === undefined ? undefined : sanitizeSubjectName(body.name);
  const color = body?.color === undefined ? undefined : body.color;

  if (name === null) {
    return jsonError("Naziv predmeta mora imati između 1 i 60 karaktera.");
  }

  if (color !== undefined && !isHexColor(color)) {
    return jsonError("Boja predmeta nije ispravna.");
  }

  if (name === undefined && color === undefined) {
    return jsonError("Nema izmena za čuvanje.");
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

    const subject = user.subjects.find((item) => String(item._id) === id);
    if (!subject) {
      return jsonError("Predmet nije pronađen.", 404);
    }

    if (name !== undefined) {
      const duplicate = user.subjects.some(
        (item) =>
          String(item._id) !== id &&
          item.name.trim().toLowerCase() === name.toLowerCase()
      );

      if (duplicate) {
        return jsonError("Predmet sa tim nazivom već postoji.", 409);
      }

      subject.name = name;
    }

    if (color !== undefined) {
      subject.color = color;
    }

    await user.save();

    const normalized = normalizeAndSerializeUser(user);
    if (normalized.changed) {
      await user.save();
    }

    const updated = normalized.subjects.find((item) => item.id === id);

    return NextResponse.json({ subject: updated ?? null });
  } catch {
    return jsonServerError();
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  const { id } = await context.params;

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

    const subject = user.subjects.find((item) => String(item._id) === id);
    if (!subject) {
      return jsonError("Predmet nije pronađen.", 404);
    }

    user.subjects = user.subjects.filter((item) => String(item._id) !== id);
    await user.save();

    return NextResponse.json({ success: true });
  } catch {
    return jsonServerError();
  }
}
