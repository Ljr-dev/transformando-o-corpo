"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function ThemeProvider() {
  const config = useSiteConfig();

  useEffect(() => {
    const root = document.documentElement;
    const theme = config.theme;

    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--surface-soft", theme.surfaceSoft);
    root.style.setProperty("--foreground", theme.foreground);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-hover", theme.primaryHover);
    root.style.setProperty("--border", theme.border);
  }, [config.theme]);

  return null;
}
