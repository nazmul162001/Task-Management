"use server";

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const secret =
  process.env.JWT_SECRET ||
  process.env.NEXT_PUBLIC_JWT_SECRET ||
  "task-manager-temp-secret";

if (!process.env.JWT_SECRET) {
  console.warn(
    "[AUTH] JWT_SECRET environment variable is not set. Falling back to a default secret. Please set JWT_SECRET for production deployments."
  );
}

const encoder = new TextEncoder();

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedKey] = hashedPassword.split(":");
  if (!salt || !storedKey) {
    return false;
  }

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedKeyBuffer = Buffer.from(storedKey, "hex");

  if (derivedKey.length !== storedKeyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKeyBuffer);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(secret));
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(secret));
  return payload as { userId: string };
}
