import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_AUTH_COOKIE = "landing_factory_admin";

const tokenPayload = "landing-factory-admin-session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function isAdminPasswordConfigured() {
  return getAdminPassword().length > 0;
}

export function createAdminToken() {
  return createHmac("sha256", getAdminPassword()).update(tokenPayload).digest("hex");
}

export function isValidAdminToken(token?: string) {
  if (!token || !isAdminPasswordConfigured()) {
    return false;
  }

  const expected = createAdminToken();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return (
    tokenBuffer.length === expectedBuffer.length &&
    timingSafeEqual(tokenBuffer, expectedBuffer)
  );
}
