import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useContent } from '@/contexts/LocaleContext';

export function CreateQuizGuideSection() {
  const { CREATE_QUIZ_GUIDE_TEXT } = useContent();
  const { header, howItWorks, steps, button } =
    CREATE_QUIZ_GUIDE_TEXT;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[var(--color-green)]/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
              {header.title}
            </h1>
            <p className="text-lg text-white opacity-90">
              {header.subtitle}
            </p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-8">
            {/* How it works */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {howItWorks.title}
              </h2>

              <div className="space-y-3 text-gray-700">
                <p>{howItWorks.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {howItWorks.badges.map((badge) => (
                    <Badge
                      key={badge.label}
                      variant={badge.variant}
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* Steps */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {steps.title}
              </h2>

              <div className="space-y-6">
                {steps.items.map((step, index) => (
                  <div
                    key={step.title}
                    className={`flex gap-4 p-4 rounded-lg bg-gray-50 border ${step.border}`}
                  >
                    <div className="shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-lg shadow-md`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>

                      <p className="text-gray-700">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="pt-6 border-t border-gray-300/40">
              <div className="flex justify-center">
                <Link href="/create">
                  <Button variant="primary" size="lg">
                    {button}
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