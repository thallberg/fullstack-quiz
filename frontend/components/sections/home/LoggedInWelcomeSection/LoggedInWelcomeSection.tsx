"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoggedInStepCard } from "./LoggedInStepCard";
import { LOGGED_IN_WELCOME_DATA } from "@/content-text/sv/loggedInWelcome";

export function LoggedInWelcomeSection() {
  const { user } = useAuth();
  const { header, about, steps, stepsTitle, footerButtons } =
    LOGGED_IN_WELCOME_DATA;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[var(--color-purple)]/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Välkommen tillbaka, {user?.username}! 🎯
            </h1>
            <p className="text-lg opacity-90">
              {header.subtitle}
            </p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-8">
            {/* About */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {about.title}
              </h2>

              <p className="mb-4">{about.description}</p>

              <div className="flex flex-wrap gap-2">
                {about.badges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant={badge.variant}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Steps */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                {stepsTitle}
              </h2>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <LoggedInStepCard
                    key={step.title}
                    step={step}
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {footerButtons.map((btn) => (
                  <Link key={btn.label} href={btn.href}>
                    <Button
                      variant={btn.variant}
                      size="lg"
                    >
                      {btn.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}