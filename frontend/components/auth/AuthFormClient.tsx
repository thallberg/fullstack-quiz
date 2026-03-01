'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { AuthFormErrorAlert } from './AuthFormErrorAlert';
import { AuthFormFields } from './AuthFormFields';
import { useAuthFormConfig } from './auth.formConfig';
import { useAuthSchemas } from './auth.validation';
import type { AuthFormMode } from './auth.types';
import { useAuthFormSubmit } from './useAuthFormSubmit';

export type { AuthFormMode } from './auth.types';

interface AuthFormClientProps {
  mode: AuthFormMode;
}

export function AuthFormClient({ mode }: AuthFormClientProps) {
  const isLogin = mode === 'login';
  const authFormConfig = useAuthFormConfig();
  const { loginSchema, registerSchema } = useAuthSchemas();
  const { onSubmit, error, isSubmitting } = useAuthFormSubmit(mode);
  const config = authFormConfig[mode];

  const form = useForm({
    defaultValues: isLogin
      ? { email: '', password: '' }
      : { username: '', email: '', password: '', confirmPassword: '' },
    validators: {
      onSubmit: isLogin ? loginSchema : registerSchema,
    },
    onSubmit,
  });

  const formId = `${mode}-form`;

  return (
    <Card className={`w-full max-w-md mx-auto ${config.cardBorderColor} shadow-xl`}>
      <CardHeader
        className={`${config.headerGradient} text-white ${config.headerBorderColor} !py-2 !px-3 sm:!py-2.5 sm:!px-4`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-md">
          {config.title}
        </h2>
      </CardHeader>
      <CardBody className="p-6 sm:p-8">
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AuthFormFields form={form} isLogin={isLogin} />

          {error && <AuthFormErrorAlert message={error} />}

          <div className="pt-2 mt-6">
            <Button
              type="submit"
              form={formId}
              className="w-full py-3 text-lg"
              isLoading={isSubmitting}
            >
              {config.submitLabel}
            </Button>
          </div>

          <div className="text-center text-base text-gray-500 pt-4">
            {config.footerText}{' '}
            <a
              href={config.linkHref}
              className="text-[var(--color-blue)] hover:underline font-medium"
            >
              {config.linkText}
            </a>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
