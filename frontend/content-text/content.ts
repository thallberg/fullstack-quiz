/**
 * Aggregates all content per locale so the app can switch between sv and en.
 * Use useContent() from LocaleContext to get the content for the current locale.
 */

import * as sv from "./sv";
import * as en from "./en";

export type Locale = "sv" | "en";

const LOCALE_STORAGE_KEY = "quiz-app-locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "sv";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" ? "en" : "sv";
}

export function getStoredLocaleSync(): Locale {
  return getStoredLocale();
}

export function storeLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export const contentSv = { ...sv } as const;
export const contentEn = { ...en } as const;

export type Content = typeof contentSv;

export function getContent(locale: Locale): Content {
  return (locale === "en" ? contentEn : contentSv) as Content;
}
