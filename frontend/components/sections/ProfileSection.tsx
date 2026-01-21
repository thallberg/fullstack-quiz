'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export function ProfileSection() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) {
      setError('Användarnamn och e-post är obligatoriska');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('E-postadressen är inte giltig');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({
        username: username.trim(),
        email: email.trim(),
      });
      setSuccess('Profil uppdaterad!');
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunde inte uppdatera profil';
      if (errorMessage.includes('Email already exists') || errorMessage.includes('already exists')) {
        setError('E-postadressen är redan registrerad. Använd en annan e-post.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div>
      {success && (
          <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-green)]/50 rounded-lg">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-[var(--color-green)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[var(--color-green)]">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-red)]/50 rounded-lg">
            <div className="flex items-start">
              <div className="shrink-0">
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

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" required className="text-base">
              Användarnamn
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required className="text-base">
              E-post
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={handleSave}
                    isLoading={isSubmitting}
                    className="flex-1 py-3 text-lg"
                  >
                    Spara
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 py-3 text-lg"
                  >
                    Avbryt
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 text-lg"
                >
                  Redigera profil
                </Button>
              )}
            </div>
            <div className="pt-4 border-t border-gray-300/50">
              <Button
                type="button"
                variant="danger"
                onClick={handleLogout}
                className="w-full py-3 text-lg"
              >
                Logga ut
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
