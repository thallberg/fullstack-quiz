'use client';

import { useState } from 'react';
import { quizDataSource } from '@/lib/data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword.trim()) {
      setError('Nuvarande lösenord är obligatoriskt');
      return;
    }

    if (!newPassword.trim()) {
      setError('Nytt lösenord är obligatoriskt');
      return;
    }

    if (newPassword.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setIsSubmitting(true);

    try {
      await quizDataSource.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccess('Lösenord ändrat!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunde inte ändra lösenord';
      if (errorMessage.includes('Invalid current password') || errorMessage.includes('current password')) {
        setError('Nuvarande lösenord är felaktigt.');
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
            <div className="p-4 bg-gray-50 border border-green-border/50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-text mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-text">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-gray-50 border border-red-border/50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-text mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-text">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword" required className="text-base">
              Nuvarande lösenord
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ditt nuvarande lösenord"
              required
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" required className="text-base">
              Nytt lösenord
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              required
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required className="text-base">
              Bekräfta nytt lösenord
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Bekräfta lösenordet"
              required
              className="py-3 text-base"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3 text-lg" isLoading={isSubmitting}>
              Ändra lösenord
            </Button>
          </div>
        </form>
  );
}
