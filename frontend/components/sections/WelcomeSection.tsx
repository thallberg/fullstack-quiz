'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function WelcomeSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-purple-400 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
              Välkommen till Quiz App! 🎯
            </h1>
            <p className="text-lg text-purple-50">
              Skapa, spela och dela quiz med andra användare
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {/* Information om Quiz */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Vad är Quiz App?
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Quiz App är en plattform där du kan skapa egna quiz med ja/nej-frågor
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
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Registrera dig
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Skapa ett konto genom att ange användarnamn, e-post och lösenord.
                      Det tar bara några sekunder!
                    </p>
                    <Link href="/register">
                      <Button variant="primary">
                        Gå till registrering →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Logga in
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Efter registrering kan du logga in med din e-post och lösenord
                      för att komma åt alla funktioner.
                    </p>
                    <Link href="/login">
                      <Button variant="secondary">
                        Gå till inloggning →
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Börja spela och skapa quiz
                    </h3>
                    <p className="text-gray-700 mb-4">
                      När du är inloggad kan du:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                      <li>Spela quiz skapade av andra användare</li>
                      <li>Skapa dina egna quiz med valfritt antal frågor</li>
                      <li>Redigera och ta bort dina egna quiz</li>
                      <li>Se resultat när du spelar quiz</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button variant="primary" size="lg">
                    Registrera dig nu
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Jag har redan ett konto
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
