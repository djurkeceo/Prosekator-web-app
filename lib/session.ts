import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import { User, type UserRecord } from "@/lib/models/User";
import type { User as PublicUser } from "@/lib/types";

export const SESSION_COOKIE_NAME = "prosekator_token";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const DEV_SECRET = "prosekator-local-development-secret-change-me";

function getSecret(): Uint8Array {
  const value = process.env.JWT_SECRET;

  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing JWT_SECRET environment variable.");
    }

    return new TextEncoder().encode(DEV_SECRET);
  }

  return new TextEncoder().encode(value);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (cookieToken) {
    const userId = await verifySessionToken(cookieToken);
    if (userId) return userId;
  }

  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return verifySessionToken(authorization.slice(7));
  }

  return null;
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  try {
    await connectDB();
    const user = (await User.findById(userId).select("name email").lean()) as
      | Pick<UserRecord, "_id" | "name" | "email">
      | null;

    if (!user) return null;

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

type CookieResponse = {
  cookies: {
    set: (options: {
      name: string;
      value: string;
      httpOnly: boolean;
      sameSite: "lax";
      secure: boolean;
      path: string;
      maxAge: number;
    }) => void;
  };
};

export function applySessionCookie(response: CookieResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: CookieResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
