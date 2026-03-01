'use client';

import { Input } from '@/components/ui/Input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export interface AuthFormFieldApi {
  name: string;
  state: { value: string; meta: { isTouched: boolean; isValid: boolean; errors: unknown } };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

interface AuthFormFieldProps {
  field: AuthFormFieldApi;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
}

export function AuthFormField({
  field,
  label,
  type,
  placeholder,
  autoComplete,
}: AuthFormFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="text-base">
        {label} <span className="text-[var(--color-red)]">*</span>
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        className="py-3 text-base"
        autoComplete={autoComplete}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
