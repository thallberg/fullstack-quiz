"use client";

import type { AuthFormMode } from "./auth.types";
import { useContent } from "@/contexts/LocaleContext";
import { useMemo } from "react";

export interface AuthFormConfig {
  title: string;
  submitLabel: string;
  cardBorderColor: string;
  headerGradient: string;
  headerBorderColor: string;
  linkHref: string;
  linkText: string;
  footerText: string;
}

export function useAuthFormConfig(): Record<AuthFormMode, AuthFormConfig> {
  const { AUTH_FORM_TEXT } = useContent();
  return useMemo(
    () => ({
      login: {
        ...AUTH_FORM_TEXT.login,
        cardBorderColor: "border-[var(--color-blue)]/50",
        headerGradient:
          "bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)]",
        headerBorderColor: "border-[var(--color-blue)]",
        linkHref: "/register",
      },
      register: {
        ...AUTH_FORM_TEXT.register,
        cardBorderColor: "border-[var(--color-pink)]/50",
        headerGradient:
          "bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-rose)]",
        headerBorderColor: "border-[var(--color-pink)]",
        linkHref: "/login",
      },
    }),
    [AUTH_FORM_TEXT]
  );
}
