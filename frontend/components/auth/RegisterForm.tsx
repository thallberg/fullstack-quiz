'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!username.trim()) {
      setError('Användarnamn är obligatoriskt');
      return;
    }

    if (username.trim().length < 3) {
      setError('Användarnamn måste vara minst 3 tecken');
      return;
    }

    if (!email.trim()) {
      setError('E-post är obligatorisk');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('E-postadressen är inte giltig');
      return;
    }

    if (!password.trim()) {
      setError('Lösenord är obligatoriskt');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ 
        username: username.trim(), 
        email: email.trim(), 
        password 
      });
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrering misslyckades';
      
      // Visa mer specifika felmeddelanden
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
  };

  return (
    <Card className="w-lg mx-auto border-pink-400 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-700 py-8">
        <h2 className="text-3xl font-bold drop-shadow-md">Registrera</h2>
      </CardHeader>
      <CardBody className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" required className="text-base">
              Användarnamn
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ditt användarnamn"
              required
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
              placeholder="din@epost.se"
              required
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required className="text-base">
              Lösenord
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              required
              className="py-3 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required className="text-base">
              Bekräfta lösenord
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

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Registrerar...' : 'Registrera'}
            </Button>
          </div>

          <div className="text-center text-base text-gray-600 pt-4">
            Har du redan ett konto?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Logga in här
            </a>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
