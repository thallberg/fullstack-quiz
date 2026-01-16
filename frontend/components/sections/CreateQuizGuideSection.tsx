'use client';

import Link from 'next/link';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function CreateQuizGuideSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-green-400 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
              Skapa ditt första Quiz! 🎯
            </h1>
            <p className="text-lg text-green-50">
              Det finns inga quiz ännu. Varför inte skapa det första?
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {/* Information om att skapa quiz */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hur fungerar det?
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Skapa ditt eget quiz med ja/nej-frågor. Du kan lägga till så många frågor
                  som du vill och ange rätt svar för varje fråga.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="info">Enkelt att skapa</Badge>
                  <Badge variant="success">Obegränsat antal frågor</Badge>
                  <Badge variant="warning">Dela med andra</Badge>
                  <Badge variant="default">Ja/Nej-frågor</Badge>
                </div>
              </div>
            </section>

            {/* Step-by-step guide */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Steg för steg
              </h2>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ge quizet en titel
                    </h3>
                    <p className="text-gray-700">
                      Välj en beskrivande titel som förklarar vad quizet handlar om.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Lägg till frågor
                    </h3>
                    <p className="text-gray-700">
                      Lägg till så många frågor du vill. Varje fråga ska vara en ja/nej-fråga.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Välj rätt svar
                    </h3>
                    <p className="text-gray-700 mb-4">
                      För varje fråga, välj om rätt svar är "Ja" eller "Nej".
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick action */}
            <section className="pt-6 border-t border-gray-200">
              <div className="flex justify-center">
                <Link href="/create">
                  <Button variant="primary" size="lg">
                    Skapa mitt första quiz
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
