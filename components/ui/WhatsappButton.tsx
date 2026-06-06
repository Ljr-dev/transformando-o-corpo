"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export function WhatsappButton() {
  const config = useSiteConfig();
  const whatsappHref = `https://wa.me/${config.contact.phone}?text=${encodeURIComponent(
    config.contact.whatsappMessage,
  )}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-[999] group"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_32px_rgba(212,166,74,0.32)] hover:scale-105 transition duration-300">
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-15" />
        <span className="relative text-xl font-black">W</span>
      </span>
    </a>
  );
}
