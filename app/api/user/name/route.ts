import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { jsonDatabaseError, jsonError, jsonServerError } from "@/lib/api-utils";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
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
    const user = await User.findById(userId).select("name");
    if (!user) {
      return jsonError("Nalog nije pronađen.", 404);
    }

    return NextResponse.json({ name: user.name });
  } catch {
    return jsonServerError();
  }
}
