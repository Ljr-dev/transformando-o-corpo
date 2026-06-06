export type SiteConfig = {
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
};

export const siteConfig: SiteConfig = {
  brand: {
    name: "Transformando o Corpo",
    highlight: "Corpo",
  },
  theme: {
    background: "#07130D",
    surface: "#102318",
    surfaceSoft: "#173522",
    foreground: "#FFFFFF",
    muted: "#C7D6CC",
    primary: "#22C55E",
    primaryHover: "#16A34A",
    border: "#295C3A",
  },
  hero: {
    eyebrow: "Emagrecimento, bem-estar e autoestima",
    title: "Dê o primeiro passo para uma vida mais leve e saudável.",
    description: "Atendimento personalizado pelo WhatsApp para quem busca orientação, soluções modernas e apoio no processo de emagrecimento com discrição e segurança.",
    primaryButton: "Falar no WhatsApp",
    secondaryButton: "Conhecer benefícios",
    image: "/images/emagrecer.png",
    stats: [
      {
        value: "100%",
        label: "Atendimento online",
      },
      {
        value: "24h",
        label: "Resposta rápida",
      },
      {
        value: "Seguro",
        label: "Contato discreto",
      },
    ],
  },
  specialtiesSection: {
    eyebrow: "Benefícios",
    title: "Uma abordagem simples para cuidar do corpo e da autoestima.",
    description: "O site apresenta uma proposta genérica de bem-estar, enquanto os detalhes sobre produtos, valores e disponibilidade são enviados diretamente pelo WhatsApp.",
    ctaLabel: "Quero saber mais",
  },
  specialties: [
    {
      title: "Controle do apetite",
      description: "Orientação para quem deseja entender alternativas que podem auxiliar na redução da fome e no controle da compulsão alimentar.",
    },
    {
      title: "Redução de medidas",
      description: "Apoio para pessoas que buscam melhorar a composição corporal, reduzir medidas e conquistar mais confiança no dia a dia.",
    },
    {
      title: "Mais autoestima",
      description: "Uma comunicação focada em transformação, bem-estar, motivação e cuidado pessoal para quem quer voltar a se sentir bem.",
    },
    {
      title: "Atendimento discreto",
      description: "Todas as informações são passadas individualmente pelo WhatsApp, com privacidade e atendimento direto.",
    },
  ],
  about: {
    eyebrow: "Como funciona",
    title: "Você chama no WhatsApp e recebe as informações completas.",
    description: "Criamos uma experiência simples: a pessoa acessa o site, entende os benefícios gerais, tira dúvidas e conversa diretamente pelo WhatsApp para receber detalhes sobre opções disponíveis.",
    image: "/images/emagrecer.png",
    features: [
      "Atendimento rápido e personalizado",
      "Informações enviadas diretamente pelo WhatsApp",
      "Comunicação discreta e objetiva",
      "Ideal para divulgar diferentes produtos futuramente",
    ],
    cardEyebrow: "ATENDIMENTO PERSONALIZADO",
    cardTitle: "Seu objetivo começa com uma conversa.",
    cardDescription: "Clique no botão, envie uma mensagem e receba orientações sobre as opções disponíveis para o seu perfil.",
  },
  testimonialsSection: {
    eyebrow: "Depoimentos",
    title: "Pessoas que decidiram mudar seus hábitos.",
    description: "Relatos ilustrativos de quem buscou apoio, orientação e soluções para iniciar uma nova fase com mais saúde e autoestima.",
    customerLabel: "Cliente",
  },
  testimonials: [
    {
      name: "Mariana Alves",
      text: "Eu estava desanimada, mas depois do atendimento consegui entender melhor as opções e comecei a cuidar mais de mim.",
    },
    {
      name: "Patrícia Gomes",
      text: "Gostei porque o atendimento foi direto pelo WhatsApp, de forma discreta e bem explicada.",
    },
    {
      name: "Renata Silva",
      text: "Eu queria algo simples para começar e recebi todas as informações de forma clara e rápida.",
    },
  ],
  contact: {
    eyebrow: "Contato",
    title: "Quer saber qual opção combina com você?",
    description: "Fale agora pelo WhatsApp e receba as informações sobre atendimento, disponibilidade e próximos passos.",
    primaryButton: "Chamar no WhatsApp",
    secondaryButton: "Enviar e-mail",
    phone: "5519990059006",
    whatsappMessage: "Olá, vi o site e gostaria de saber mais sobre as opções para emagrecimento e bem-estar.",
    address: "Atendimento online",
    email: "",
    hours: "Todos os dias até  as 23:00",
    serviceArea: "Emagrecimento, bem-estar e autoestima",
  },
  footer: {
    description: "Site informativo sobre emagrecimento, bem-estar e autoestima. As informações detalhadas são enviadas individualmente pelo WhatsApp.",
  },
};

export const SITE_CONFIG_STORAGE_KEY = "transformando-o-corpo-premium:site-config";

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
