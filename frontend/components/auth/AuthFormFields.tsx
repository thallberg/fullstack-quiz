'use client';

import { FieldGroup } from '@/components/ui/field';
import { AuthFormField, type AuthFormFieldApi } from './AuthFormField';
import { useContent } from '@/contexts/LocaleContext';

interface AuthFormFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  isLogin: boolean;
}

export function AuthFormFields({ form, isLogin }: AuthFormFieldsProps) {
  const { AUTH_FIELDS_TEXT } = useContent();

  return (
    <FieldGroup>
      {!isLogin && (
        <form.Field name="username">
          {(field: AuthFormFieldApi) => (
            <AuthFormField
              field={field}
              label={AUTH_FIELDS_TEXT.username.label}
              type="text"
              placeholder={AUTH_FIELDS_TEXT.username.placeholder}
              autoComplete="username"
            />
          )}
        </form.Field>
      )}

      <form.Field name="email">
        {(field: AuthFormFieldApi) => (
          <AuthFormField
            field={field}
            label={AUTH_FIELDS_TEXT.email.label}
            type="email"
            placeholder={AUTH_FIELDS_TEXT.email.placeholder}
            autoComplete="email"
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field: AuthFormFieldApi) => (
          <AuthFormField
            field={field}
            label={AUTH_FIELDS_TEXT.password.label}
            type="password"
            placeholder={
              isLogin
                ? AUTH_FIELDS_TEXT.password.placeholderLogin
                : AUTH_FIELDS_TEXT.password.placeholderRegister
            }
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        )}
      </form.Field>

      {!isLogin && (
        <form.Field name="confirmPassword">
          {(field: AuthFormFieldApi) => (
            <AuthFormField
              field={field}
              label={AUTH_FIELDS_TEXT.confirmPassword.label}
              type="password"
              placeholder={AUTH_FIELDS_TEXT.confirmPassword.placeholder}
              autoComplete="new-password"
            />
          )}
        </form.Field>
      )}
    </FieldGroup>
  );
}
