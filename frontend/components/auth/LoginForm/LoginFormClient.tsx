'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-post är obligatorisk')
    .email('E-postadressen är inte giltig'),
  password: z
    .string()
    .min(1, 'Lösenord är obligatoriskt'),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setError('');
      setIsSubmitting(true);

      try {
        await login({ email: value.email.trim(), password: value.password });
        router.push('/');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Inloggning misslyckades';

        if (errorMessage.includes('Invalid email or password') || errorMessage.includes('401')) {
          setError('Fel e-post eller lösenord. Kontrollera dina uppgifter och försök igen.');
        } else if (errorMessage.includes('Email')) {
          setError('E-postadressen är inte giltig.');
        } else {
          setError(errorMessage || 'Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto border-[var(--color-blue)]/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-md">Logga in</h2>
      </CardHeader>
      <CardBody className="p-6 sm:p-8">
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-base">
                      E-post <span className="text-[var(--color-red)]">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="din@epost.se"
                      className="py-3 text-base"
                      autoComplete="email"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-base">
                      Lösenord <span className="text-[var(--color-red)]">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ditt lösenord"
                      className="py-3 text-base"
                      autoComplete="current-password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          {error && (
            <div className="p-4 bg-gray-50 border border-[var(--color-red)]/50 rounded-lg mt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[var(--color-red)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--color-red)]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 mt-6">
            <Button type="submit" form="login-form" className="w-full py-3 text-lg" isLoading={isSubmitting}>
              Logga in
            </Button>
          </div>

          <div className="text-center text-base text-gray-500 pt-4">
            Har du inget konto?{' '}
            <a href="/register" className="text-[var(--color-blue)] hover:underline font-medium">
              Registrera här
            </a>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
