"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Testimonials() {
  const config = useSiteConfig();

  return (
    <section
      id="depoimentos"
      className="relative section-spacing bg-background text-foreground overflow-hidden"
    >
      <div className="container-premium relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 px-5 py-3 rounded-lg uppercase tracking-[0.28em] text-primary text-[10px] md:text-[11px] font-medium">
              {config.testimonialsSection.eyebrow}
            </span>

            <h2 className="mt-8 max-w-4xl text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em]">
              {config.testimonialsSection.title}
            </h2>

            <p className="mt-6 max-w-2xl text-muted text-base md:text-lg leading-relaxed">
              {config.testimonialsSection.description}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {config.testimonials.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                className="hover-lift relative rounded-lg border border-theme bg-surface-soft p-7 md:p-8 hover:border-[color:var(--primary)]/40"
              >
                <span className="text-primary text-5xl leading-none">
                  &quot;
                </span>

                <p className="mt-5 text-zinc-300 leading-relaxed text-base md:text-lg">
                  {item.text}
                </p>

                <div className="mt-8 pt-5 border-t border-theme">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className="mt-2 block text-zinc-500 uppercase tracking-[0.25em] text-xs">
                    {config.testimonialsSection.customerLabel}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
