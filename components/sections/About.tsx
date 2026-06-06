"use client";

import Image from "next/image";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function About() {
  const config = useSiteConfig();

  return (
    <section
      id="sobre"
      className="relative section-spacing bg-surface text-foreground overflow-hidden"
    >
      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-start max-w-2xl">
            <span className="inline-flex border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 px-5 py-3 rounded-lg uppercase tracking-[0.28em] text-primary text-[10px] md:text-[11px] font-medium">
              {config.about.eyebrow}
            </span>

            <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em]">
              {config.about.title}
            </h2>

            <p className="mt-7 text-muted text-base md:text-lg leading-relaxed max-w-xl">
              {config.about.description}
            </p>

            <div className="mt-10 grid gap-4 w-full max-w-xl">
              {config.about.features.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-4 rounded-lg border border-theme bg-black/25 p-4"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                  <p className="text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-lg border border-theme min-h-[430px] md:min-h-[560px] w-full max-w-[520px] bg-surface-soft">
              <Image
                src={config.about.image}
                alt={config.about.title}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover brightness-[0.78]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                <span className="inline-flex border border-[color:var(--primary)]/25 bg-black/45 backdrop-blur-sm px-4 py-2 rounded-lg uppercase tracking-[0.22em] text-primary text-[10px] font-medium">
                  {config.about.cardEyebrow}
                </span>

                <h3 className="mt-5 text-3xl md:text-4xl font-black">
                  {config.about.cardTitle}
                </h3>

                <p className="mt-3 text-zinc-300 leading-relaxed max-w-md text-sm md:text-base">
                  {config.about.cardDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
