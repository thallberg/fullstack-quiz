'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MessageBox } from '@/components/ui/messageBox';
import { PROFILE_TEXT } from '@/constant/sv/Profile';
import { validateProfile } from './Profile.Validation';

export function ProfileSection() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [originalUsername, setOriginalUsername] = useState(user?.username || '');
  const [originalEmail, setOriginalEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;

    setOriginalUsername(user.username || '');
    setOriginalEmail(user.email || '');

    if (!isEditing) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user, isEditing]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = async () => {
    const validation = validateProfile({
      username,
      email,
      originalUsername,
      originalEmail,
    });

    if (validation.success === false) {
      setError(validation.message);
      return;
    }

    if (validation.success === 'noChanges') {
      setError('');
      setSuccess(validation.message);
      setIsEditing(false);
      return;
    }

    // Här vet TypeScript att success === true
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(validation.data);

      setSuccess(PROFILE_TEXT.messages.updated);
      setOriginalUsername(validation.data.username);
      setOriginalEmail(validation.data.email);
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : PROFILE_TEXT.messages.updateError;

      if (errorMessage.includes('already exists')) {
        setError(PROFILE_TEXT.messages.emailExists);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUsername(originalUsername);
    setEmail(originalEmail);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const fields = [
    {
      id: 'username',
      label: PROFILE_TEXT.fields.username,
      value: username,
      setValue: setUsername,
      type: 'text',
    },
    {
      id: 'email',
      label: PROFILE_TEXT.fields.email,
      value: email,
      setValue: setEmail,
      type: 'email',
    },
  ] as const;

  return (
    <div>
      <MessageBox message={success} variant="success" />
      <MessageBox message={error} variant="error" />

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} required className="text-base">
              {field.label}
            </Label>

            <Input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              disabled={!isEditing}
              className="py-3 text-base"
            />
          </div>
        ))}

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
                  {PROFILE_TEXT.buttons.save}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-lg"
                >
                  {PROFILE_TEXT.buttons.cancel}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 text-lg"
              >
                {PROFILE_TEXT.buttons.edit}
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
              {PROFILE_TEXT.buttons.logout}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}