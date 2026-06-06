import {
  ADMIN_AUTH_COOKIE,
  createAdminToken,
  getAdminPassword,
  isAdminPasswordConfigured,
  isValidAdminToken,
} from "@/config/adminAuth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 8,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;

  return Response.json({
    authenticated: isValidAdminToken(token),
    configured: isAdminPasswordConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return Response.json(
      {
        authenticated: false,
        message: "Senha do admin nao configurada.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { password?: string };

  if (body.password !== getAdminPassword()) {
    return Response.json(
      {
        authenticated: false,
        message: "Senha invalida.",
      },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_AUTH_COOKIE, createAdminToken(), cookieOptions);

  return Response.json({
    authenticated: true,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_AUTH_COOKIE);

  return Response.json({
    authenticated: false,
  });
}
