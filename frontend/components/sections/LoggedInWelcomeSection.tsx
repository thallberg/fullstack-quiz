'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function LoggedInWelcomeSection() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[var(--color-purple)]/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
              Välkommen tillbaka, {user?.username}! 🎯
            </h1>
            <p className="text-lg text-white opacity-90">
              Skapa, spela och dela quiz med andra användare
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {/* Information om Quiz */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Vad kan du göra?
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Quiz App är din plattform för att skapa egna quiz med ja/nej-frågor
                  och utmana dig själv eller andra användare. Testa dina kunskaper,
                  skapa roliga utmaningar eller använd det för utbildning!
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="info">Skapa quiz</Badge>
                  <Badge variant="success">Spela quiz</Badge>
                  <Badge variant="warning">Dela med andra</Badge>
                  <Badge variant="default">Ja/Nej-frågor</Badge>
                </div>
              </div>
            </section>

            {/* Step-by-step guide */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Kom igång - Steg för steg
              </h2>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-blue)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-cyan)] text-white flex items-center justify-center font-bold text-lg shadow-md">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Utforska quiz
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Bläddra bland alla tillgängliga quiz och spela dem för att testa dina kunskaper
                      och se hur du presterar!
                    </p>
                    <Link href="/quizzes">
                      <Button variant="primary">
                        Se alla quiz →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-purple)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-pink)] text-white flex items-center justify-center font-bold text-lg shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Skapa ditt första quiz
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Skapa ditt eget quiz med valfritt antal ja/nej-frågor.
                      Du kan göra det privat eller dela det med andra användare!
                    </p>
                    <Link href="/create">
                      <Button variant="secondary">
                        Skapa quiz →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-green)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-green)] to-[var(--color-emerald)] text-white flex items-center justify-center font-bold text-lg shadow-md">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Utforska mer funktioner
                    </h3>
                    <p className="text-gray-700 mb-4">
                      När du är redo kan du:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                      <li>Se din leaderboard och jämföra resultat</li>
                      <li>Hantera dina quiz i din profil</li>
                      <li>Lägga till vänner och utmana dem</li>
                      <li>Redigera och ta bort dina egna quiz</li>
                    </ul>
                    <div className="flex gap-2 flex-wrap">
                      <Link href="/leaderboard">
                        <Button variant="outline" size="sm">
                          Leaderboard
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="outline" size="sm">
                          Min Profil
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="pt-6 border-t border-gray-300/40">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button variant="primary" size="lg">
                    Skapa nytt quiz
                  </Button>
                </Link>
                <Link href="/quizzes">
                  <Button variant="outline" size="lg">
                    Utforska quiz
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
