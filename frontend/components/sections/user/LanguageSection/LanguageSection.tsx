"use client";

import { useContent, useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/Button";

export function LanguageSection() {
  const { PROFILE_PAGE_TEXT } = useContent();
  const { locale, setLocale } = useLocale();

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm sm:text-base">
        {PROFILE_PAGE_TEXT.languageDescription}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant={locale === "sv" ? "primary" : "outline"}
          size="sm"
          onClick={() => setLocale("sv")}
          className="min-w-[120px]"
        >
          {PROFILE_PAGE_TEXT.languageOptionSv}
        </Button>
        <Button
          variant={locale === "en" ? "primary" : "outline"}
          size="sm"
          onClick={() => setLocale("en")}
          className="min-w-[120px]"
        >
          {PROFILE_PAGE_TEXT.languageOptionEn}
        </Button>
      </div>
    </div>
  );
}
