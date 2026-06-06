import type { SiteConfig } from "@/config/siteConfig";

const siteConfigTypeSource = `export type SiteConfig = {
  brand: {
    name: string;
    highlight: string;
  };
  theme: {
    background: string;
    surface: string;
    surfaceSoft: string;
    foreground: string;
    muted: string;
    primary: string;
    primaryHover: string;
    border: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    image: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  specialtiesSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  specialties: Array<{
    title: string;
    description: string;
  }>;
  about: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    features: string[];
    cardEyebrow: string;
    cardTitle: string;
    cardDescription: string;
  };
  testimonialsSection: {
    eyebrow: string;
    title: string;
    description: string;
    customerLabel: string;
  };
  testimonials: Array<{
    name: string;
    text: string;
  }>;
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    phone: string;
    whatsappMessage: string;
    address: string;
    email: string;
    hours: string;
    serviceArea: string;
  };
  footer: {
    description: string;
  };
};`;

function formatKey(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function toTsLiteral(value: unknown, depth = 0): string {
  const indent = "  ".repeat(depth);
  const nextIndent = "  ".repeat(depth + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    return [
      "[",
      ...value.map((item) => `${nextIndent}${toTsLiteral(item, depth + 1)},`),
      `${indent}]`,
    ].join("\n");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return "{}";
    }

    return [
      "{",
      ...entries.map(
        ([key, item]) =>
          `${nextIndent}${formatKey(key)}: ${toTsLiteral(item, depth + 1)},`,
      ),
      `${indent}}`,
    ].join("\n");
  }

  return JSON.stringify(value);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSiteConfigFile(config: SiteConfig) {
  const storageKey = `${slugify(config.brand.name) || "site"}-premium:site-config`;

  return `${siteConfigTypeSource}

export const siteConfig: SiteConfig = ${toTsLiteral(config)};

export const SITE_CONFIG_STORAGE_KEY = ${JSON.stringify(storageKey)};

export function mergeSiteConfig(config: Partial<SiteConfig> = {}): SiteConfig {
  return {
    ...siteConfig,
    ...config,
    brand: { ...siteConfig.brand, ...config.brand },
    theme: { ...siteConfig.theme, ...config.theme },
    hero: {
      ...siteConfig.hero,
      ...config.hero,
      stats: config.hero?.stats ?? siteConfig.hero.stats,
    },
    specialtiesSection: {
      ...siteConfig.specialtiesSection,
      ...config.specialtiesSection,
    },
    specialties: config.specialties ?? siteConfig.specialties,
    about: {
      ...siteConfig.about,
      ...config.about,
      features: config.about?.features ?? siteConfig.about.features,
    },
    testimonialsSection: {
      ...siteConfig.testimonialsSection,
      ...config.testimonialsSection,
    },
    testimonials: config.testimonials ?? siteConfig.testimonials,
    contact: { ...siteConfig.contact, ...config.contact },
    footer: { ...siteConfig.footer, ...config.footer },
  };
}
`;
}
