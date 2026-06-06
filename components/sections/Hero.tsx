"use client";

import Image from "next/image";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Hero() {
  const config = useSiteConfig();

  return (
    <section className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Image
        src={config.hero.image}
        alt={config.brand.name}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-transparent to-black/40" />

      <div className="container-premium relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-4xl pt-32 pb-20 text-left">
          <div className="inline-flex items-center justify-center border border-[color:var(--primary)]/30 bg-black/35 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full">
            <span className="uppercase tracking-[0.22em] md:tracking-[0.32em] text-primary text-[10px] md:text-xs font-semibold">
              {config.hero.eyebrow}
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl font-black tracking-[-0.03em] leading-[0.98] text-4xl sm:text-5xl md:text-6xl lg:text-[78px]">
            {config.hero.title}
          </h1>

          <p className="mt-7 max-w-2xl text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed">
            {config.hero.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-xl">
            <a
              href="#contato"
              className="group bg-primary text-black px-7 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 bg-primary-hover hover:scale-[1.01] transition duration-300"
            >
              {config.hero.primaryButton}
              <span className="group-hover:translate-x-1 transition duration-300">
                -&gt;
              </span>
            </a>

            <a
              href="#especialidades"
              className="group border border-white/20 bg-black/25 backdrop-blur px-7 py-4 rounded-lg flex items-center justify-center gap-3 hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition duration-300"
            >
              {config.hero.secondaryButton}
              <span className="group-hover:translate-x-1 transition duration-300">
                -&gt;
              </span>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {config.hero.stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="border-l border-[color:var(--primary)] pl-5"
              >
                <strong className="block text-3xl md:text-4xl font-black text-primary">
                  {stat.value}
                </strong>
                <span className="mt-2 block text-zinc-300 text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
