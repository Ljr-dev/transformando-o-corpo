"use client";

import { useContext } from "react";
import { SiteConfigContext } from "@/components/config/EditableConfigProvider";

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
