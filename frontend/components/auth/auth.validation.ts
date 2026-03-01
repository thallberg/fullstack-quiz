"use client";

import * as z from "zod";
import { useContent } from "@/contexts/LocaleContext";
import { useMemo } from "react";

export type LoginValues = { email: string; password: string };
export type RegisterValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function createLoginSchema(AUTH_VALIDATION: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}) {
  return z.object({
    email: z
      .string()
      .min(1, AUTH_VALIDATION.emailRequired)
      .email(AUTH_VALIDATION.emailInvalid),
    password: z.string().min(1, AUTH_VALIDATION.passwordRequired),
  });
}

function createRegisterSchema(AUTH_VALIDATION: {
  usernameRequired: string;
  usernameMinLength: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
}) {
  return z
    .object({
      username: z
        .string()
        .min(1, AUTH_VALIDATION.usernameRequired)
        .min(3, AUTH_VALIDATION.usernameMinLength),
      email: z
        .string()
        .min(1, AUTH_VALIDATION.emailRequired)
        .email(AUTH_VALIDATION.emailInvalid),
      password: z
        .string()
        .min(1, AUTH_VALIDATION.passwordRequired)
        .min(6, AUTH_VALIDATION.passwordMinLength),
      confirmPassword: z
        .string()
        .min(1, AUTH_VALIDATION.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: AUTH_VALIDATION.passwordsMismatch,
      path: ["confirmPassword"],
    });
}

export function useAuthSchemas() {
  const { AUTH_VALIDATION } = useContent();
  return useMemo(
    () => ({
      loginSchema: createLoginSchema(AUTH_VALIDATION),
      registerSchema: createRegisterSchema(AUTH_VALIDATION),
    }),
    [AUTH_VALIDATION]
  );
}
