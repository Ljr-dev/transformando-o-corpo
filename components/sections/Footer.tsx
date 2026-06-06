"use client";

import { useMemo } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function getBrandParts(name: string, highlight: string) {
  const index = name.toLowerCase().lastIndexOf(highlight.toLowerCase());

  if (index < 0) {
    return { primary: name, accent: highlight };
  }

  return {
    primary: name.slice(0, index).trim(),
    accent: name.slice(index).trim(),
  };
}

export function Footer() {
  const config = useSiteConfig();
  const brand = useMemo(
    () => getBrandParts(config.brand.name, config.brand.highlight),
    [config.brand.name, config.brand.highlight],
  );
  const whatsappHref = `https://wa.me/${config.contact.phone}?text=${encodeURIComponent(
    config.contact.whatsappMessage,
  )}`;

  return (
    <footer className="relative bg-background text-foreground overflow-hidden border-t border-theme">
      <div className="container-premium relative z-10 py-14 md:py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
            {brand.primary}
            <span className="text-primary ml-2">{brand.accent}</span>
          </h2>

          <p className="mt-5 max-w-2xl text-muted leading-relaxed text-base md:text-lg">
            {config.footer.description}
          </p>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7 text-muted text-sm md:text-base">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition duration-300"
            >
              WhatsApp
            </a>

            <span className="hidden md:block text-zinc-800">|</span>

            <a
              href={`mailto:${config.contact.email}`}
              className="hover:text-primary transition duration-300"
            >
              {config.contact.email}
            </a>

            <span className="hidden md:block text-zinc-800">|</span>

            <span>{config.contact.address}</span>
          </div>

          <div className="mt-10 pt-7 border-t border-theme w-full">
            <p className="text-zinc-600 text-sm text-center leading-relaxed">
              © 2026 {config.brand.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
