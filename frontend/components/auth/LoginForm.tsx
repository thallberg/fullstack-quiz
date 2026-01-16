'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('E-post är obligatorisk');
      return;
    }

    if (!password.trim()) {
      setError('Lösenord är obligatoriskt');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Inloggning misslyckades';
      
      // Visa mer specifika felmeddelanden
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
  };

  return (
    <Card className="w-lg mx-auto border-blue-400 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 py-8">
        <h2 className="text-3xl font-bold drop-shadow-md">Logga in</h2>
      </CardHeader>
      <CardBody className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Ditt lösenord"
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
              {isSubmitting ? 'Loggar in...' : 'Logga in'}
            </Button>
          </div>

          <div className="text-center text-base text-gray-600 pt-4">
            Har du inget konto?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Registrera här
            </a>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
