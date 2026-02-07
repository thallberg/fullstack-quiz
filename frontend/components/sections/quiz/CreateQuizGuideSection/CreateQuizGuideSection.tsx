import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CreateQuizGuideSection() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[var(--color-green)]/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
              Skapa ditt första Quiz! 🎯
            </h1>
            <p className="text-lg text-white opacity-90">
              Det finns inga quiz ännu. Varför inte skapa det första?
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
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

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Steg för steg
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-orange)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-yellow)] text-white flex items-center justify-center font-bold text-lg shadow-md">
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

                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-pink)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-rose)] text-white flex items-center justify-center font-bold text-lg shadow-md">
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

                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-[var(--color-teal)]/50">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-cyan)] text-white flex items-center justify-center font-bold text-lg shadow-md">
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

            <section className="pt-6 border-t border-gray-300/40">
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
