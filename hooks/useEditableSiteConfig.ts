"use client";

import { useEffect, useState } from "react";
import {
  SITE_CONFIG_STORAGE_KEY,
  mergeSiteConfig,
  siteConfig,
  type SiteConfig,
} from "@/config/siteConfig";

const SITE_CONFIG_CHANNEL = "editable-site-config";

function loadConfig() {
  try {
    const stored = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    return stored ? mergeSiteConfig(JSON.parse(stored)) : siteConfig;
  } catch {
    return siteConfig;
  }
}

export function useEditableSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(() =>
    typeof window === "undefined" ? siteConfig : loadConfig(),
  );

  useEffect(() => {
    window.localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("editable-site-config-change"));

    const channel =
      "BroadcastChannel" in window
        ? new BroadcastChannel(SITE_CONFIG_CHANNEL)
        : null;

    channel?.postMessage(config);
    channel?.close();
  }, [config]);

  function restoreDefault() {
    window.localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
    setConfig(siteConfig);
    window.dispatchEvent(new Event("editable-site-config-change"));
  }

  return {
    config,
    setConfig,
    restoreDefault,
  };
}
