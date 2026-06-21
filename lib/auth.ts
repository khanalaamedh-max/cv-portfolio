import { createHmac, timingSafeEqual } from "crypto";

const encoder = new TextEncoder();

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeBase64Url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  return Buffer.from(input + (pad ? "=".repeat(4 - pad) : ""), "base64");
}

function getSecret() {
  return process.env.JWT_SECRET || "local-development-secret-change-before-deploy";
}

export function adminCredentials() {
  return {
    id: process.env.ADMIN_ID || "9749897650",
    password: process.env.ADMIN_PASSWORD || "Sandip@123"
  };
}

export function safeCompare(a: string, b: string) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

export function createToken(payload: Record<string, unknown>) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    })
  );
  const signature = base64Url(
    createHmac("sha256", getSecret()).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [header, body, signature] = parts;
  const expected = base64Url(
    createHmac("sha256", getSecret()).update(`${header}.${body}`).digest()
  );

  if (!safeCompare(signature, expected)) {
    return false;
  }

  const payload = JSON.parse(decodeBase64Url(body).toString("utf8")) as {
    exp?: number;
  };

  return Boolean(payload.exp && payload.exp > Math.floor(Date.now() / 1000));
}

export function requireAdmin(authorization: string | null) {
  const token = authorization?.replace("Bearer ", "");
  return Boolean(token && verifyToken(token));
}
