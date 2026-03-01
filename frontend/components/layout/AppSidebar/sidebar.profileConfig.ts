"use client";

import type { LucideIcon } from "lucide-react";
import { User, CreditCard, Settings } from "lucide-react";
import { useContent } from "@/contexts/LocaleContext";
import { useMemo } from "react";

export interface ProfileNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function useSidebarProfileConfig() {
  const { NAV_TEXT } = useContent();
  return useMemo(
    () => ({
      profileNavItems: [
        { title: NAV_TEXT.profile, url: "/profile", icon: User },
        { title: NAV_TEXT.account, url: "/account", icon: CreditCard },
        { title: NAV_TEXT.settings, url: "/settings", icon: Settings },
      ] as ProfileNavItem[],
    }),
    [NAV_TEXT]
  );
}
