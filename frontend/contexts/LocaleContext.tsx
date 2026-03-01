"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  getContent,
  getStoredLocaleSync,
  storeLocale,
  type Locale,
  type Content,
} from "@/content-text/content";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: Content;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("sv");

  useEffect(() => {
    setLocaleState(getStoredLocaleSync());
  }, []);

  const setLocale = useMemo(
    () => (newLocale: Locale) => {
      storeLocale(newLocale);
      setLocaleState(newLocale);
    },
    []
  );

  const content = useMemo(() => getContent(locale), [locale]);

  const value = useMemo<LocaleContextType>(
    () => ({ locale, setLocale, content }),
    [locale, setLocale, content]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (ctx === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

/** Hook to get the current locale content. Use this instead of importing from content-text/sv. */
export function useContent(): Content {
  return useLocale().content;
}
