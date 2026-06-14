import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  isAdminConfigReady,
  readAdminSessionFromRequest,
  validateAdminCredentials
} from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = readAdminSessionFromRequest(request);

  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email ?? null,
    configReady: isAdminConfigReady()
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!isAdminConfigReady()) {
    return NextResponse.json(
      { error: "Admin credentials are not configured yet. Update frontend/.env.local first." },
      { status: 503 }
    );
  }

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid admin email or password." }, { status: 401 });
  }

  const token = createAdminSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set({
    name: getAdminSessionCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({ authenticated: true, email });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminSessionCookieName());
  return NextResponse.json({ authenticated: false });
}
