#!/usr/bin/env node

import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const root = process.cwd();
const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...value] = arg.slice(2).split("=");
      return [key, value.join("=") || "true"];
    }),
);

const excluded = new Set([
  ".git",
  ".next",
  "node_modules",
  "rocha-backups",
  "next-dev.log",
  "next-dev.err.log",
  "next-start.log",
  "next-start.err.log",
  ".barbearia-config.json",
]);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function upperParts(professionalName) {
  const cleanName = professionalName
    .replace(/^dr\.?\s+/i, "")
    .replace(/^dra\.?\s+/i, "")
    .trim();
  const parts = cleanName.split(/\s+/);
  const first = parts[0] || "NOME";
  const last = parts.length > 1 ? parts.at(-1) : "SOBRENOME";

  return {
    primary: `DR. ${first.toUpperCase()}`,
    accent: last.toUpperCase(),
  };
}

async function ask(question, fallback = "") {
  const answer = (await rl.question(`${question}${fallback ? ` (${fallback})` : ""}: `)).trim();
  return answer || fallback;
}

async function askService(index, fallbackTitle, fallbackDescription) {
  const title = await ask(`Área ${index} - título`, fallbackTitle);
  const description = await ask(`Área ${index} - descrição`, fallbackDescription);

  return {
    title,
    description,
    link: "#contato",
  };
}

async function loadConfig(configPath) {
  const absoluteConfigPath = path.resolve(root, configPath);
  const raw = await readFile(absoluteConfigPath, "utf8");
  return JSON.parse(raw);
}

async function collectConfig() {
  if (args.has("config")) {
    return loadConfig(args.get("config"));
  }

  const professionalName = await ask("Nome do profissional", "Dr. João Almeida");
  const brandName = await ask("Nome do site/escritório", `${professionalName} Advocacia`);
  const whatsappLabel = await ask("WhatsApp visível", "(19) 98214-4043");
  const whatsappNumber = await ask("WhatsApp para link, só números com DDI", "5519982144043");
  const email = await ask("E-mail", "contato@advocacia.com");
  const oab = await ask("OAB", "OAB 000.000");
  const siteUrl = await ask("URL final do site", "https://exemplo.com.br");
  const serviceArea = await ask("Área de atendimento", "Todo o Brasil");
  const officeHours = await ask("Horário", "Segunda a sexta, 08h às 18h");
  const experience = await ask("Anos de experiência", "10+");
  const cases = await ask("Casos atendidos", "+500");
  const logo = upperParts(professionalName);

  return {
    brandName,
    professionalName,
    logoPrimary: await ask("Logo - primeira parte", logo.primary),
    logoAccent: await ask("Logo - destaque", logo.accent),
    oab,
    email,
    whatsappNumber,
    whatsappLabel,
    serviceArea,
    officeHours,
    siteUrl,
    imagePath: "/images/lawyer.jpg",
    hero: {
      badge: await ask("Hero - selo", "Advocacia especializada"),
      title: await ask("Hero - título", "Defesa jurídica clara, estratégica e humanizada."),
      description: await ask(
        "Hero - descrição",
        "Atendimento jurídico estratégico, humanizado e focado na melhor solução para o seu caso.",
      ),
      primaryCta: "Agendar consulta",
      secondaryCta: "Ver áreas de atuação",
    },
    stats: [
      {
        value: cases,
        label: "casos atendidos",
      },
      {
        value: experience,
        label: "anos de experiência",
      },
      {
        value: serviceArea === "Todo o Brasil" ? "Brasil" : serviceArea,
        label: serviceArea === "Todo o Brasil" ? "atendimento nacional" : "área de atendimento",
      },
    ],
    services: [
      await askService(
        1,
        "Direito Previdenciário",
        "Aposentadorias, benefícios, revisões do INSS e planejamento previdenciário com análise cuidadosa dos documentos.",
      ),
      await askService(
        2,
        "Direito Trabalhista",
        "Atuação em verbas rescisórias, vínculos, acordos, defesa e orientação preventiva para relações de trabalho.",
      ),
      await askService(
        3,
        "Direito Civil",
        "Contratos, indenizações, cobranças e assessoria jurídica para pessoas, famílias e empresas.",
      ),
    ],
    about: {
      badge: "Sobre o advogado",
      title: await ask("Sobre - título", "Experiência jurídica com atendimento próximo."),
      description: await ask(
        "Sobre - descrição",
        `${professionalName} oferece assessoria jurídica estratégica, atendimento personalizado e soluções eficientes para clientes em ${serviceArea}.`,
      ),
      features: [
        "Análise clara do cenário e das chances do caso",
        "Atendimento online ou presencial",
        "Acompanhamento profissional durante todo o processo",
      ],
      cardDescription:
        "Especialista em soluções jurídicas estratégicas para pessoas e empresas.",
    },
    testimonials: [
      {
        name: "Cliente atendido",
        text: "Atendimento profissional, claro e humanizado durante todo o processo.",
      },
      {
        name: "Cliente atendido",
        text: "Recebi orientação objetiva e acompanhamento cuidadoso em cada etapa.",
      },
      {
        name: "Cliente atendido",
        text: "O caso foi conduzido com segurança, estratégia e comunicação transparente.",
      },
    ],
    contact: {
      title: "Precisa de orientação jurídica?",
      description:
        "Envie uma mensagem e receba um primeiro direcionamento sobre o melhor caminho para o seu caso.",
    },
    footerDescription:
      "Atendimento jurídico estratégico, humanizado e focado na defesa dos direitos dos clientes.",
  };
}

function siteContentSource(config) {
  return `export const siteContent = ${JSON.stringify(config, null, 2)};\n`;
}

async function updatePackageName(projectPath, projectName) {
  const packagePath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  packageJson.name = slugify(projectName) || packageJson.name;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
}

const rl = createInterface({ input, output });

try {
  const config = await collectConfig();
  const defaultFolder = slugify(config.brandName) || "novo-site";
  const targetInput = args.get("target") || (await ask("Pasta de destino", `..\\${defaultFolder}`));
  const targetPath = path.resolve(root, targetInput);

  if (existsSync(targetPath)) {
    throw new Error(`A pasta de destino já existe: ${targetPath}`);
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(root, targetPath, {
    recursive: true,
    filter(source) {
      return !excluded.has(path.basename(source));
    },
  });

  await writeFile(path.join(targetPath, "content", "site.ts"), siteContentSource(config), "utf8");
  await updatePackageName(targetPath, config.brandName);

  console.log("");
  console.log("Site clonado com sucesso.");
  console.log(`Destino: ${targetPath}`);
  console.log("");
  console.log("Próximos passos:");
  console.log(`cd "${targetPath}"`);
  console.log("npm install");
  console.log("npm run dev");
} catch (error) {
  console.error("");
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
