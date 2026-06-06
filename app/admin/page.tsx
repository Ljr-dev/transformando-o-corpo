"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useEditableSiteConfig } from "@/hooks/useEditableSiteConfig";
import { mergeSiteConfig, type SiteConfig } from "@/config/siteConfig";
import { generateSiteConfigFile } from "@/config/generateSiteConfigFile";

type ThemeKey = keyof SiteConfig["theme"];
type StatKey = keyof SiteConfig["hero"]["stats"][number];
type SpecialtyKey = keyof SiteConfig["specialties"][number];
type TestimonialKey = keyof SiteConfig["testimonials"][number];

const themeLabels: Record<ThemeKey, string> = {
  background: "Fundo",
  surface: "Superficie",
  surfaceSoft: "Superficie suave",
  foreground: "Texto principal",
  muted: "Texto secundario",
  primary: "Primaria",
  primaryHover: "Primaria hover",
  border: "Borda",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-lg border border-zinc-800 bg-black/35 px-3 py-2 text-white outline-none focus:border-[color:var(--primary)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 resize-y rounded-lg border border-zinc-800 bg-black/35 px-3 py-2 text-white outline-none focus:border-[color:var(--primary)]"
      />
    </label>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-5 md:p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const { config, setConfig, restoreDefault } = useEditableSiteConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [siteConfigFile, setSiteConfigFile] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const response = await fetch("/api/admin-auth", {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          authenticated?: boolean;
          configured?: boolean;
        };

        if (!active) {
          return;
        }

        setIsAuthenticated(Boolean(data.authenticated));
        setAuthStatus(
          data.configured === false
            ? "Senha do admin nao configurada. Defina ADMIN_PASSWORD no .env.local."
            : "",
        );
      } catch {
        if (active) {
          setAuthStatus("Nao foi possivel verificar a senha do admin.");
        }
      } finally {
        if (active) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  function updateBrand(key: keyof SiteConfig["brand"], value: string) {
    setConfig((current) => ({
      ...current,
      brand: { ...current.brand, [key]: value },
    }));
  }

  function updateTheme(key: ThemeKey, value: string) {
    setConfig((current) => ({
      ...current,
      theme: { ...current.theme, [key]: value },
    }));
  }

  function updateHero(key: keyof Omit<SiteConfig["hero"], "stats">, value: string) {
    setConfig((current) => ({
      ...current,
      hero: { ...current.hero, [key]: value },
    }));
  }

  function updateStat(index: number, key: StatKey, value: string) {
    setConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: current.hero.stats.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function addStat() {
    setConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: [...current.hero.stats, { value: "Novo", label: "estatistica" }],
      },
    }));
  }

  function removeStat(index: number) {
    setConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: current.hero.stats.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function updateSpecialty(index: number, key: SpecialtyKey, value: string) {
    setConfig((current) => ({
      ...current,
      specialties: current.specialties.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function updateSpecialtiesSection(
    key: keyof SiteConfig["specialtiesSection"],
    value: string,
  ) {
    setConfig((current) => ({
      ...current,
      specialtiesSection: { ...current.specialtiesSection, [key]: value },
    }));
  }

  function addSpecialty() {
    setConfig((current) => ({
      ...current,
      specialties: [
        ...current.specialties,
        { title: "Nova especialidade", description: "Descricao do servico." },
      ],
    }));
  }

  function removeSpecialty(index: number) {
    setConfig((current) => ({
      ...current,
      specialties: current.specialties.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateAbout(key: keyof SiteConfig["about"], value: string | string[]) {
    setConfig((current) => ({
      ...current,
      about: { ...current.about, [key]: value },
    }));
  }

  function updateTestimonial(index: number, key: TestimonialKey, value: string) {
    setConfig((current) => ({
      ...current,
      testimonials: current.testimonials.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function updateTestimonialsSection(
    key: keyof SiteConfig["testimonialsSection"],
    value: string,
  ) {
    setConfig((current) => ({
      ...current,
      testimonialsSection: { ...current.testimonialsSection, [key]: value },
    }));
  }

  function addTestimonial() {
    setConfig((current) => ({
      ...current,
      testimonials: [
        ...current.testimonials,
        { name: "Cliente", text: "Depoimento do cliente." },
      ],
    }));
  }

  function removeTestimonial(index: number) {
    setConfig((current) => ({
      ...current,
      testimonials: current.testimonials.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateContact(key: keyof SiteConfig["contact"], value: string) {
    setConfig((current) => ({
      ...current,
      contact: { ...current.contact, [key]: value },
    }));
  }

  function updateFooter(value: string) {
    setConfig((current) => ({
      ...current,
      footer: { ...current.footer, description: value },
    }));
  }

  function handleRestore() {
    restoreDefault();
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthStatus("Validando senha...");

    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      setPassword("");
      setIsAuthenticated(true);
      setAuthStatus("");
    } catch {
      setAuthStatus("Senha invalida ou admin nao configurado.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-auth", {
      method: "DELETE",
    });
    setIsAuthenticated(false);
    setPassword("");
  }

  function downloadFile(filename: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleExportSiteConfig() {
    setSiteConfigFile(generateSiteConfigFile(config));
    setExportStatus("");
  }

  async function handleSaveSiteConfig() {
    setIsSaving(true);
    setSaveStatus("Salvando config/siteConfig.ts...");

    try {
      const response = await fetch("/api/site-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSaveStatus("config/siteConfig.ts atualizado. Agora faca commit e push.");
    } catch {
      setSaveStatus("Nao foi possivel salvar automaticamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCopySiteConfig() {
    try {
      await navigator.clipboard.writeText(siteConfigFile);
      setExportStatus("siteConfig.ts copiado.");
    } catch {
      setExportStatus("Nao foi possivel copiar automaticamente.");
    }
  }

  function handleDownloadSiteConfig() {
    downloadFile("siteConfig.ts", siteConfigFile, "text/typescript;charset=utf-8");
    setExportStatus("Download do siteConfig.ts iniciado.");
  }

  function handleDownloadJson() {
    downloadFile(
      "config.json",
      JSON.stringify(config, null, 2),
      "application/json;charset=utf-8",
    );
    setImportStatus("Download do config.json iniciado.");
  }

  function handleImportJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedConfig = mergeSiteConfig(
          JSON.parse(String(reader.result)) as Partial<SiteConfig>,
        );

        setConfig(importedConfig);
        setImportStatus(`${file.name} importado com sucesso.`);
      } catch {
        setImportStatus("Arquivo JSON invalido.");
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setImportStatus("Nao foi possivel ler o arquivo JSON.");
      event.target.value = "";
    };

    reader.readAsText(file);
  }

  if (isCheckingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050505] px-4 text-white">
        <p className="text-sm text-zinc-300">Verificando acesso ao painel...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050505] px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="grid w-full max-w-sm gap-5 rounded-lg border border-zinc-800 bg-zinc-950/80 p-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--primary)]">
              Painel interno
            </p>
            <h1 className="mt-3 text-3xl font-black">Acesso restrito</h1>
          </div>

          <label className="grid gap-2 text-sm text-zinc-300">
            <span>Senha do admin</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="min-h-11 rounded-lg border border-zinc-800 bg-black/35 px-3 py-2 text-white outline-none focus:border-[color:var(--primary)]"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-[color:var(--primary)] px-5 py-3 font-semibold text-black hover:bg-[color:var(--primary-hover)]"
          >
            Entrar
          </button>

          <p className="min-h-5 text-sm text-zinc-300" aria-live="polite">
            {authStatus}
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <header className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-5 md:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--primary)]">
              Painel interno
            </p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">
              Editor da landing page
            </h1>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
            Este painel salva as alteracoes automaticamente no navegador usando
            localStorage. Para publicar no GitHub e na Vercel, salve o site no
            arquivo config/siteConfig.ts e envie o commit para o repositorio.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleSaveSiteConfig}
              disabled={isSaving}
              className="rounded-lg bg-[color:var(--primary)] px-5 py-3 font-semibold text-black hover:bg-[color:var(--primary-hover)]"
            >
              {isSaving ? "Salvando..." : "Salvar site para publicar"}
            </button>
            <button
              type="button"
              onClick={handleExportSiteConfig}
              className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-[color:var(--primary)]"
            >
              Exportar siteConfig.ts
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-[color:var(--primary)]"
            >
              Baixar Configuracao JSON
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-[color:var(--primary)]"
            >
              Importar Configuracao JSON
            </button>
            <button
              type="button"
              onClick={handleRestore}
              className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-red-500"
            >
              Restaurar padrao
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-red-500"
            >
              Sair do admin
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>

          <p className="text-sm text-zinc-300" aria-live="polite">
            Salvamento automatico ativo. {saveStatus || importStatus}
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,620px)_minmax(0,1fr)] xl:items-start">
          <div className="grid gap-6">
        <Card title="Cores do tema">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(config.theme) as ThemeKey[]).map((key) => (
              <label key={key} className="grid gap-2 text-sm text-zinc-300">
                <span>{themeLabels[key]}</span>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/35 p-2">
                  <input
                    type="color"
                    value={config.theme[key]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateTheme(key, event.target.value)
                    }
                    className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.theme[key]}
                    onChange={(event) => updateTheme(key, event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-white outline-none"
                  />
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Marca">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Nome da marca"
              value={config.brand.name}
              onChange={(value) => updateBrand("name", value)}
            />
            <Field
              label="Destaque"
              value={config.brand.highlight}
              onChange={(value) => updateBrand("highlight", value)}
            />
          </div>
        </Card>

        <Card title="Hero">
          <Field
            label="Eyebrow"
            value={config.hero.eyebrow}
            onChange={(value) => updateHero("eyebrow", value)}
          />
          <TextArea
            label="Titulo principal"
            value={config.hero.title}
            onChange={(value) => updateHero("title", value)}
          />
          <TextArea
            label="Descricao"
            value={config.hero.description}
            onChange={(value) => updateHero("description", value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Botao primario"
              value={config.hero.primaryButton}
              onChange={(value) => updateHero("primaryButton", value)}
            />
            <Field
              label="Botao secundario"
              value={config.hero.secondaryButton}
              onChange={(value) => updateHero("secondaryButton", value)}
            />
          </div>
          <Field
            label="Imagem do Hero"
            value={config.hero.image}
            onChange={(value) => updateHero("image", value)}
          />
        </Card>

        <Card title="Estatisticas">
          {config.hero.stats.map((stat, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-zinc-800 p-4 md:grid-cols-[1fr_2fr_auto]">
              <Field
                label="Valor"
                value={stat.value}
                onChange={(value) => updateStat(index, "value", value)}
              />
              <Field
                label="Legenda"
                value={stat.label}
                onChange={(value) => updateStat(index, "label", value)}
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="self-end rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-red-500"
              >
                Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addStat} className="rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-[color:var(--primary)]">
            Adicionar estatistica
          </button>
        </Card>

        <Card title="Especialidades">
          <Field
            label="Eyebrow da secao"
            value={config.specialtiesSection.eyebrow}
            onChange={(value) => updateSpecialtiesSection("eyebrow", value)}
          />
          <TextArea
            label="Titulo da secao"
            value={config.specialtiesSection.title}
            onChange={(value) => updateSpecialtiesSection("title", value)}
          />
          <TextArea
            label="Descricao da secao"
            value={config.specialtiesSection.description}
            onChange={(value) => updateSpecialtiesSection("description", value)}
          />
          <Field
            label="Texto do link dos cards"
            value={config.specialtiesSection.ctaLabel}
            onChange={(value) => updateSpecialtiesSection("ctaLabel", value)}
          />
          {config.specialties.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-zinc-800 p-4">
              <Field
                label="Titulo"
                value={item.title}
                onChange={(value) => updateSpecialty(index, "title", value)}
              />
              <TextArea
                label="Descricao"
                value={item.description}
                onChange={(value) => updateSpecialty(index, "description", value)}
              />
              <button
                type="button"
                onClick={() => removeSpecialty(index)}
                className="w-fit rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-red-500"
              >
                Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addSpecialty} className="rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-[color:var(--primary)]">
            Adicionar especialidade
          </button>
        </Card>

        <Card title="Sobre">
          <Field
            label="Eyebrow da secao"
            value={config.about.eyebrow}
            onChange={(value) => updateAbout("eyebrow", value)}
          />
          <TextArea
            label="Titulo"
            value={config.about.title}
            onChange={(value) => updateAbout("title", value)}
          />
          <TextArea
            label="Descricao"
            value={config.about.description}
            onChange={(value) => updateAbout("description", value)}
          />
          <Field
            label="Imagem"
            value={config.about.image}
            onChange={(value) => updateAbout("image", value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Eyebrow do card com imagem"
              value={config.about.cardEyebrow}
              onChange={(value) => updateAbout("cardEyebrow", value)}
            />
            <Field
              label="Titulo do card com imagem"
              value={config.about.cardTitle}
              onChange={(value) => updateAbout("cardTitle", value)}
            />
          </div>
          <TextArea
            label="Descricao do card com imagem"
            value={config.about.cardDescription}
            onChange={(value) => updateAbout("cardDescription", value)}
          />
          <TextArea
            label="Itens de apoio (um por linha)"
            value={config.about.features.join("\n")}
            onChange={(value) =>
              updateAbout(
                "features",
                value.split("\n").filter((item) => item.trim().length > 0),
              )
            }
          />
        </Card>

        <Card title="Depoimentos">
          <Field
            label="Eyebrow da secao"
            value={config.testimonialsSection.eyebrow}
            onChange={(value) => updateTestimonialsSection("eyebrow", value)}
          />
          <TextArea
            label="Titulo da secao"
            value={config.testimonialsSection.title}
            onChange={(value) => updateTestimonialsSection("title", value)}
          />
          <TextArea
            label="Descricao da secao"
            value={config.testimonialsSection.description}
            onChange={(value) => updateTestimonialsSection("description", value)}
          />
          <Field
            label="Rotulo do cliente"
            value={config.testimonialsSection.customerLabel}
            onChange={(value) => updateTestimonialsSection("customerLabel", value)}
          />
          {config.testimonials.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-zinc-800 p-4">
              <Field
                label="Nome"
                value={item.name}
                onChange={(value) => updateTestimonial(index, "name", value)}
              />
              <TextArea
                label="Texto"
                value={item.text}
                onChange={(value) => updateTestimonial(index, "text", value)}
              />
              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                className="w-fit rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-red-500"
              >
                Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addTestimonial} className="rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:border-[color:var(--primary)]">
            Adicionar depoimento
          </button>
        </Card>

        <Card title="Contato e WhatsApp">
          <Field
            label="Eyebrow da secao"
            value={config.contact.eyebrow}
            onChange={(value) => updateContact("eyebrow", value)}
          />
          <TextArea
            label="Titulo"
            value={config.contact.title}
            onChange={(value) => updateContact("title", value)}
          />
          <TextArea
            label="Descricao"
            value={config.contact.description}
            onChange={(value) => updateContact("description", value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Botao WhatsApp"
              value={config.contact.primaryButton}
              onChange={(value) => updateContact("primaryButton", value)}
            />
            <Field
              label="Botao e-mail"
              value={config.contact.secondaryButton}
              onChange={(value) => updateContact("secondaryButton", value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="WhatsApp"
              value={config.contact.phone}
              onChange={(value) => updateContact("phone", value)}
            />
            <Field
              label="E-mail"
              value={config.contact.email}
              onChange={(value) => updateContact("email", value)}
            />
            <Field
              label="Endereco"
              value={config.contact.address}
              onChange={(value) => updateContact("address", value)}
            />
            <Field
              label="Horario"
              value={config.contact.hours}
              onChange={(value) => updateContact("hours", value)}
            />
          </div>
          <TextArea
            label="Mensagem do WhatsApp"
            value={config.contact.whatsappMessage}
            onChange={(value) => updateContact("whatsappMessage", value)}
          />
          <Field
            label="Atendimento"
            value={config.contact.serviceArea}
            onChange={(value) => updateContact("serviceArea", value)}
          />
        </Card>

        <Card title="Rodape">
          <TextArea
            label="Descricao"
            value={config.footer.description}
            onChange={updateFooter}
          />
        </Card>
          </div>

          <aside className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 xl:sticky xl:top-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Preview em tempo real
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  As alteracoes aparecem aqui enquanto voce edita.
                </p>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:border-[color:var(--primary)]"
              >
                Abrir pagina
              </a>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black">
              <iframe
                title="Preview da landing page"
                src="/"
                className="h-[720px] w-full bg-black"
              />
            </div>
          </aside>
        </div>
      </div>

      {siteConfigFile ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-config-export-title"
            className="grid max-h-[90vh] w-full max-w-4xl gap-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-2xl md:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2
                  id="site-config-export-title"
                  className="text-2xl font-black text-white"
                >
                  siteConfig.ts gerado
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Copie o conteudo ou baixe o arquivo para substituir
                  config/siteConfig.ts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSiteConfigFile("")}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:border-red-500"
              >
                Fechar
              </button>
            </div>

            <textarea
              readOnly
              value={siteConfigFile}
              className="h-[52vh] resize-none rounded-lg border border-zinc-800 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-100 outline-none"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCopySiteConfig}
                className="rounded-lg bg-[color:var(--primary)] px-5 py-3 font-semibold text-black hover:bg-[color:var(--primary-hover)]"
              >
                Copiar
              </button>
              <button
                type="button"
                onClick={handleDownloadSiteConfig}
                className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-white hover:border-[color:var(--primary)]"
              >
                Baixar arquivo
              </button>
              <p className="text-sm text-zinc-300" aria-live="polite">
                {exportStatus}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
