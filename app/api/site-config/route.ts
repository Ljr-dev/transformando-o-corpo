import { writeFile } from "node:fs/promises";
import path from "node:path";

import { ADMIN_AUTH_COOKIE, isValidAdminToken } from "@/config/adminAuth";
import { generateSiteConfigFile } from "@/config/generateSiteConfigFile";
import { mergeSiteConfig, type SiteConfig } from "@/config/siteConfig";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;

    if (!isValidAdminToken(token)) {
      return Response.json(
        {
          ok: false,
          message: "Sessao do admin invalida.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Partial<SiteConfig>;
    const config = mergeSiteConfig(body);
    const filePath = path.join(process.cwd(), "config", "siteConfig.ts");

    await writeFile(filePath, generateSiteConfigFile(config), "utf8");

    return Response.json({
      ok: true,
      file: "config/siteConfig.ts",
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Nao foi possivel salvar config/siteConfig.ts.",
      },
      { status: 500 },
    );
  }
}
