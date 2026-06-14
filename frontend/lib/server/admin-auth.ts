import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const sessionCookieName = "fairhaven_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  email: string;
  expiresAt: number;
};

function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim() ?? "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "change-this-session-secret";
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function decodePayload(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AdminSessionPayload;
  } catch {
    return null;
  }
}

function parseSessionToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!payload || payload.expiresAt <= Date.now()) {
    return null;
  }

  return payload;
}

export function getAdminSessionCookieName() {
  return sessionCookieName;
}

export function isAdminConfigReady() {
  return Boolean(getAdminEmail() && getAdminPassword() && getSessionSecret());
}

export function validateAdminCredentials(email: string, password: string) {
  return email === getAdminEmail() && password === getAdminPassword();
}

export function createAdminSessionToken(email: string) {
  const payload: AdminSessionPayload = {
    email,
    expiresAt: Date.now() + sessionDurationMs
  };
  const encodedPayload = encodePayload(payload);
  return `${encodedPayload}.${signValue(encodedPayload)}`;
}

export function readAdminSessionFromRequest(request: NextRequest) {
  return parseSessionToken(request.cookies.get(sessionCookieName)?.value);
}

export async function readAdminSession() {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(sessionCookieName)?.value);
}
