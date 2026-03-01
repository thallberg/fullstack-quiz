'use client';

import { useState, type FormEvent } from 'react';
import { quizDataSource } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { validateChangePassword } from './password.validation';
import { useContent } from '@/contexts/LocaleContext';

type FieldConfig = {
  id: string;
  label: string;
  placeholder: string;
  state: string;
  setState: (value: string) => void;
};

export function ChangePasswordForm() {
  const { CHANGE_PASSWORD_TEXT } = useContent();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fields: FieldConfig[] = [
    {
      id: 'currentPassword',
      label: CHANGE_PASSWORD_TEXT.labels.currentPassword,
      placeholder: CHANGE_PASSWORD_TEXT.placeholders.currentPassword,
      state: currentPassword,
      setState: setCurrentPassword,
    },
    {
      id: 'newPassword',
      label: CHANGE_PASSWORD_TEXT.labels.newPassword,
      placeholder: CHANGE_PASSWORD_TEXT.placeholders.newPassword,
      state: newPassword,
      setState: setNewPassword,
    },
    {
      id: 'confirmPassword',
      label: CHANGE_PASSWORD_TEXT.labels.confirmPassword,
      placeholder: CHANGE_PASSWORD_TEXT.placeholders.confirmPassword,
      state: confirmPassword,
      setState: setConfirmPassword,
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    const validation = validateChangePassword(
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      CHANGE_PASSWORD_TEXT.validation
    );
  
    if (!validation.success) {
      setError(validation.message);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await quizDataSource.changePassword({
        currentPassword,
        newPassword,
      });
  
      setSuccess(CHANGE_PASSWORD_TEXT.messages.success);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : CHANGE_PASSWORD_TEXT.messages.genericError;
  
      if (errorMessage.includes('current password')) {
        setError(CHANGE_PASSWORD_TEXT.messages.invalidCurrent);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 bg-gray-50 border border-[var(--color-green)]/50 rounded-lg">
          <p className="text-sm font-medium text-[var(--color-green)]">
            {success}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-gray-50 border border-[var(--color-red)]/50 rounded-lg">
          <p className="text-sm font-medium text-[var(--color-red)]">
            {error}
          </p>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} required className="text-base">
            {field.label}
          </Label>

          <Input
            id={field.id}
            type="password"
            value={field.state}
            onChange={(e) => field.setState(e.target.value)}
            placeholder={field.placeholder}
            required
            className="py-3 text-base"
          />
        </div>
      ))}

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full py-3 text-lg"
          isLoading={isSubmitting}
        >
          {CHANGE_PASSWORD_TEXT.button}
        </Button>
      </div>
    </form>
  );
}