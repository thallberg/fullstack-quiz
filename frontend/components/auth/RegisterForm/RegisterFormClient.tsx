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

const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Användarnamn är obligatoriskt')
    .min(3, 'Användarnamn måste vara minst 3 tecken'),
  email: z
    .string()
    .min(1, 'E-post är obligatorisk')
    .email('E-postadressen är inte giltig'),
  password: z
    .string()
    .min(1, 'Lösenord är obligatoriskt')
    .min(6, 'Lösenordet måste vara minst 6 tecken'),
  confirmPassword: z
    .string()
    .min(1, 'Bekräfta lösenord är obligatoriskt'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Lösenorden matchar inte',
  path: ['confirmPassword'],
});

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setError('');
      setIsSubmitting(true);

      try {
        await register({
          username: value.username.trim(),
          email: value.email.trim(),
          password: value.password,
        });
        router.push('/');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registrering misslyckades';

        if (errorMessage.includes('Email already exists') || errorMessage.includes('already exists')) {
          setError('E-postadressen är redan registrerad. Använd en annan e-post eller logga in.');
        } else if (errorMessage.includes('Email')) {
          setError('E-postadressen är inte giltig.');
        } else if (errorMessage.includes('Username')) {
          setError('Användarnamnet är inte tillgängligt.');
        } else {
          setError(errorMessage || 'Registrering misslyckades. Kontrollera dina uppgifter och försök igen.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto border-[var(--color-pink)]/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-rose)] text-white border-[var(--color-pink)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-md">Registrera</h2>
      </CardHeader>
      <CardBody className="p-6 sm:p-8">
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="username">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-base">
                      Användarnamn <span className="text-[var(--color-red)]">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ditt användarnamn"
                      className="py-3 text-base"
                      autoComplete="username"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="email">
              {(field) => {
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
            </form.Field>
            <form.Field name="password">
              {(field) => {
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
                      placeholder="Minst 6 tecken"
                      className="py-3 text-base"
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-base">
                      Bekräfta lösenord <span className="text-[var(--color-red)]">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Bekräfta lösenordet"
                      className="py-3 text-base"
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
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
            <Button type="submit" form="register-form" className="w-full py-3 text-lg" isLoading={isSubmitting}>
              Registrera
            </Button>
          </div>

          <div className="text-center text-base text-gray-500 pt-4">
            Har du redan ett konto?{' '}
            <a href="/login" className="text-[var(--color-blue)] hover:underline font-medium">
              Logga in här
            </a>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
