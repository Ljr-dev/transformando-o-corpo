#!/usr/bin/env node

import { createServer } from "node:net";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, openSync } from "node:fs";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const root = process.cwd();
const rl = createInterface({ input, output });

const excluded = new Set([
  ".git",
  ".next",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  "node_modules",
  "next-dev.log",
  "next-dev.err.log",
  "next-start.log",
  "next-start.err.log",
  "dev-3001.log",
  "dev-3001.err.log",
]);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getHighlight(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.at(-1) || name).toUpperCase();
}

function createPassword() {
  return randomBytes(9).toString("base64url");
}

async function ask(question, fallback = "") {
  const suffix = fallback ? ` (${fallback})` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || fallback;
}

function isInsideProject(targetPath) {
  const relative = path.relative(root, targetPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function updatePackageName(projectPath, projectName) {
  const packagePath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  packageJson.name = slugify(projectName) || packageJson.name;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
}

async function updateDefaultBrand(projectPath, projectName) {
  const configPath = path.join(projectPath, "config", "siteConfig.ts");
  const brandName = projectName.toUpperCase();
  const highlight = getHighlight(projectName);
  const source = await readFile(configPath, "utf8");
  const updated = source
    .replace(
      /brand:\s*{\s*name:\s*"[^"]*",\s*highlight:\s*"[^"]*",\s*}/,
      `brand: {\n    name: "${brandName}",\n    highlight: "${highlight}",\n  }`,
    )
    .replace(/eyebrow:\s*"BARBEARIA PREMIUM"/, `eyebrow: "${brandName}"`)
    .replace(/cardEyebrow:\s*"BARBEARIA PREMIUM"/, `cardEyebrow: "${brandName}"`)
    .replace(/cardTitle:\s*"BARBEARIA PREMIUM"/, `cardTitle: "${brandName}"`);

  await writeFile(configPath, updated, "utf8");
}

async function writeLocalEnv(projectPath, adminPassword) {
  const envPath = path.join(projectPath, ".env.local");
  const source = [
    "# Gerado pelo assistente da Landing Factory.",
    "# Este arquivo fica somente na maquina local e nao deve ir para o Git.",
    `ADMIN_PASSWORD=${adminPassword}`,
    "",
  ].join("\n");

  await writeFile(envPath, source, "utf8");
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} falhou com codigo ${code}`));
    });
  });
}

function startDevServer(projectPath, port) {
  const out = path.join(projectPath, "next-dev.log");
  const err = path.join(projectPath, "next-dev.err.log");
  const child = spawn("npm.cmd", ["run", "dev", "--", "--port", String(port)], {
    cwd: projectPath,
    detached: true,
    shell: false,
    stdio: ["ignore", openSync(out, "a"), openSync(err, "a")],
    windowsHide: true,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });

  child.unref();
}

function openBrowser(url) {
  spawn("cmd", ["/c", "start", "", url], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  }).unref();
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + 50; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error("Nao encontrei uma porta livre entre 3000 e 3049.");
}

async function waitForServer(url) {
  const deadline = Date.now() + 60000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return true;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return false;
}

try {
  console.log("");
  console.log("Criar novo sistema a partir deste projeto");
  console.log("");

  const projectName = await ask("Nome do novo sistema", "Novo Sistema");
  const generatedPassword = createPassword();
  const adminPassword = await ask("Senha do painel /admin", generatedPassword);
  const defaultParent = path.resolve(root, "..");
  const parentInput = await ask("Local de salvamento", defaultParent);
  const parentPath = path.resolve(parentInput);
  const targetPath = path.join(parentPath, slugify(projectName) || "novo-sistema");

  if (existsSync(targetPath)) {
    throw new Error(`A pasta de destino ja existe: ${targetPath}`);
  }

  if (isInsideProject(targetPath)) {
    throw new Error("Escolha um local fora da pasta atual do projeto.");
  }

  await mkdir(parentPath, { recursive: true });

  console.log("");
  console.log("Copiando arquivos...");
  await cp(root, targetPath, {
    recursive: true,
    filter(source) {
      return !excluded.has(path.basename(source));
    },
  });

  await updatePackageName(targetPath, projectName);
  await updateDefaultBrand(targetPath, projectName);
  await writeLocalEnv(targetPath, adminPassword);

  console.log("");
  console.log("Instalando dependencias no novo sistema...");
  await run("npm.cmd", ["install"], targetPath);

  const port = await findFreePort(3000);
  const url = `http://localhost:${port}/admin`;

  console.log("");
  console.log("Iniciando servidor local...");
  startDevServer(targetPath, port);

  console.log("Aguardando o painel ficar pronto...");
  await waitForServer(url);

  console.log(`Abrindo painel: ${url}`);
  openBrowser(url);

  console.log("");
  console.log("Novo sistema criado com sucesso.");
  console.log(`Pasta: ${targetPath}`);
  console.log(`Painel: ${url}`);
  console.log(`Senha do admin: ${adminPassword}`);
  console.log("");
  console.log("A senha foi salva em .env.local no novo sistema.");
  console.log("Na Vercel, cadastre a mesma variavel ADMIN_PASSWORD.");
  console.log("");
  console.log("Para abrir manualmente depois:");
  console.log(`cd "${targetPath}"`);
  console.log(`npm run dev -- --port ${port}`);
} catch (error) {
  console.error("");
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
