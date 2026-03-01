"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useContent } from "@/contexts/LocaleContext";

export function LayoutHeader() {
  const { NAV_TEXT } = useContent();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-blue)] text-white">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-white drop-shadow-md">
          {NAV_TEXT.appNameWithIcon}
        </span>
      </div>
    </header>
  );
}
