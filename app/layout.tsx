import "./globals.css";

import { EditableConfigProvider } from "@/components/config/EditableConfigProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/config/siteConfig";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: siteConfig.brand.name,
  description: siteConfig.hero.description,
  keywords: [
    "barbearia premium",
    "landing page barbearia",
    "corte masculino",
    "barba",
    "agendamento barbearia",
  ],
  authors: [
    {
      name: "Quiz Rocha",
    },
  ],
  creator: "Quiz Rocha",
  openGraph: {
    title: siteConfig.brand.name,
    description: siteConfig.hero.description,
    siteName: siteConfig.brand.name,
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <EditableConfigProvider>
          <ThemeProvider />
          {children}
        </EditableConfigProvider>
      </body>
    </html>
  );
}
