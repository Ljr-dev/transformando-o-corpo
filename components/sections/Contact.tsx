"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Contact() {
  const config = useSiteConfig();
  const whatsappHref = `https://wa.me/${config.contact.phone}?text=${encodeURIComponent(
    config.contact.whatsappMessage,
  )}`;
  const contactItems = [
    { label: "Atendimento", value: config.contact.serviceArea },
    { label: "Horario", value: config.contact.hours },
    { label: "Endereco", value: config.contact.address },
  ];

  return (
    <section
      id="contato"
      className="relative section-spacing bg-surface text-foreground overflow-hidden"
    >
      <div className="container-premium relative z-10">
        <div className="relative overflow-hidden rounded-lg border border-theme bg-surface-soft">
          <div className="absolute inset-0 bg-[color:var(--primary)]/[0.03]" />

          <div className="relative z-10 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="px-6 py-12 md:px-12 md:py-16 lg:px-14">
              <span className="inline-flex border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 px-5 py-3 rounded-lg uppercase tracking-[0.28em] text-primary text-[10px] md:text-[11px] font-medium">
                {config.contact.eyebrow}
              </span>

              <h2 className="mt-8 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em]">
                {config.contact.title}
              </h2>

              <p className="mt-6 max-w-2xl text-muted text-base md:text-lg leading-relaxed">
                {config.contact.description}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-3 bg-primary text-black px-7 py-4 rounded-lg font-semibold bg-primary-hover hover:scale-[1.01] transition duration-300"
                >
                  {config.contact.primaryButton}
                  <span className="group-hover:translate-x-1 transition duration-300">
                    -&gt;
                  </span>
                </a>

                <a
                  href={`mailto:${config.contact.email}`}
                  className="inline-flex items-center justify-center border border-theme px-7 py-4 rounded-lg font-semibold hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)]/10"
                >
                  {config.contact.secondaryButton}
                </a>
              </div>
            </div>

            <div className="border-t border-theme lg:border-l lg:border-t-0">
              <div className="grid h-full">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col justify-center border-b border-theme px-6 py-8 last:border-b-0 md:px-10"
                  >
                    <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs">
                      {item.label}
                    </p>
                    <p className="mt-3 text-xl md:text-2xl font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
