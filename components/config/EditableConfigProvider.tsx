"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SITE_CONFIG_STORAGE_KEY,
  mergeSiteConfig,
  siteConfig,
  type SiteConfig,
} from "@/config/siteConfig";

export const SiteConfigContext = createContext<SiteConfig>(siteConfig);
const SITE_CONFIG_CHANNEL = "editable-site-config";

function readStoredConfig() {
  try {
    const stored = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    return stored ? mergeSiteConfig(JSON.parse(stored)) : siteConfig;
  } catch {
    return siteConfig;
  }
}

type EditableConfigProviderProps = {
  children: ReactNode;
};

export function EditableConfigProvider({
  children,
}: EditableConfigProviderProps) {
  const [config, setConfig] = useState<SiteConfig>(siteConfig);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setConfig(readStoredConfig());
      setMounted(true);
    });

    const channel =
      "BroadcastChannel" in window
        ? new BroadcastChannel(SITE_CONFIG_CHANNEL)
        : null;

    function handleStorage(event: StorageEvent) {
      if (event.key === SITE_CONFIG_STORAGE_KEY) {
        setConfig(readStoredConfig());
      }
    }

    function handleEditableConfigChange() {
      setConfig(readStoredConfig());
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("editable-site-config-change", handleEditableConfigChange);
    if (channel) {
      channel.onmessage = (event: MessageEvent<SiteConfig>) => {
        setConfig(event.data);
      };
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "editable-site-config-change",
        handleEditableConfigChange,
      );
      channel?.close();
    };
  }, []);

  const value = useMemo(() => config, [config]);

  if (!mounted) {
    return null;
  }

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}
