"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Projects() {
  const config = useSiteConfig();

  return (
    <section
      id="especialidades"
      className="relative section-spacing bg-background text-foreground overflow-hidden"
    >
      <div className="container-premium relative z-10">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="inline-flex border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 px-5 py-3 rounded-lg uppercase tracking-[0.28em] text-primary text-[10px] md:text-[11px] font-medium">
                {config.specialtiesSection.eyebrow}
              </span>

              <h2 className="mt-8 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em]">
                {config.specialtiesSection.title}
              </h2>
            </div>

            <p className="max-w-2xl text-muted text-base md:text-lg leading-relaxed lg:ml-auto">
              {config.specialtiesSection.description}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {config.specialties.map((service, index) => (
              <article
                key={`${service.title}-${index}`}
                className="group hover-lift relative min-h-[300px] rounded-lg border border-theme bg-surface-soft p-7 md:p-8 hover:border-[color:var(--primary)]/40"
              >
                <span className="text-sm font-semibold text-primary">
                  0{index + 1}
                </span>

                <h3 className="mt-7 text-2xl md:text-3xl font-black leading-tight">
                  {service.title}
                </h3>

                <p className="mt-5 text-muted leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>

                <a
                  href="#contato"
                  className="group/button mt-8 inline-flex items-center gap-3 text-primary font-semibold hover:text-white"
                >
                  {config.specialtiesSection.ctaLabel}
                  <span className="group-hover/button:translate-x-1 transition duration-300">
                    -&gt;
                  </span>
                </a>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
