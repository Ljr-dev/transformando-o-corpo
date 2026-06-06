"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const links = [
  { label: "Especialidades", href: "#especialidades" },
  { label: "Sobre", href: "#sobre" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

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

export function Navbar() {
  const config = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = useMemo(
    () => getBrandParts(config.brand.name, config.brand.highlight),
    [config.brand.name, config.brand.highlight],
  );
  const whatsappHref = `https://wa.me/${config.contact.phone}?text=${encodeURIComponent(
    config.contact.whatsappMessage,
  )}`;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-black/80 backdrop-blur-xl border-b border-theme"
          : "bg-transparent"
      }`}
    >
      <div className="container-premium">
        <div className="h-20 flex items-center justify-between gap-4">
          <a
            href="#"
            className="flex items-center leading-none font-black tracking-tight shrink-0"
            onClick={() => setOpen(false)}
            aria-label="Ir para o inicio"
          >
            <span className="text-lg sm:text-2xl text-foreground">
              {brand.primary}
            </span>
            <span className="text-lg sm:text-2xl text-primary ml-2">
              {brand.accent}
            </span>
          </a>

          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Menu principal"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="uppercase tracking-[0.22em] text-[11px] lg:text-xs text-muted hover:text-foreground transition duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="items-center justify-center border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-primary hover:text-black transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-black/30 text-white"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="text-xl leading-none">{open ? "x" : "="}</span>
          </button>
        </div>

        {open ? (
          <nav className="md:hidden pb-5" aria-label="Menu mobile">
            <div className="grid gap-2 border-t border-theme pt-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-zinc-200 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-lg bg-primary px-3 py-3 text-center font-semibold text-black"
                onClick={() => setOpen(false)}
              >
                Falar no WhatsApp
              </a>
            </div>
          </nav>
        ) : null}
      </div>
    </motion.header>
  );
}
