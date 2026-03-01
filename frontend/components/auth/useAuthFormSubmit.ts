'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/LocaleContext';
import { parseAuthError } from './auth.errorHandling';
import type { AuthFormMode } from './auth.types';
import type { RegisterValues } from './auth.validation';

export function useAuthFormSubmit(mode: AuthFormMode) {
  const router = useRouter();
  const { login, register } = useAuth();
  const { AUTH_ERRORS } = useContent();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = React.useCallback(
    async ({ value }: { value: { email: string; password: string } | RegisterValues }) => {
      setError('');
      setIsSubmitting(true);

      try {
        if (mode === 'login') {
          await login({ email: value.email.trim(), password: value.password });
        } else {
          const regValue = value as RegisterValues;
          await register({
            username: regValue.username.trim(),
            email: regValue.email.trim(),
            password: regValue.password,
          });
        }
        router.push('/');
      } catch (err) {
        setError(parseAuthError(err, mode === 'login', AUTH_ERRORS));
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, login, register, router, AUTH_ERRORS]
  );

  return { onSubmit, error, isSubmitting };
}
