import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import {
  assertSameOrigin,
  jsonDatabaseError,
  jsonError,
  jsonServerError,
} from "@/lib/api-utils";
import { clearSessionCookie, getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Neispravan zahtev.", 403);
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Nisi prijavljen.", 401);
  }

  try {
    await connectDB();
  } catch {
    return jsonDatabaseError();
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return jsonError("Nalog nije pronađen.", 404);
    }

    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  } catch {
    return jsonServerError();
  }
}
