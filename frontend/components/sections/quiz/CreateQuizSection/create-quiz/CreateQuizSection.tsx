'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { CreateQuizForm } from './CreateQuizForm';
import { useContent } from '@/contexts/LocaleContext';

export function CreateQuizSection() {
  const { CREATE_QUIZ_TEXT } = useContent();

  return (
    <Card className="border-[var(--color-indigo)]/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-purple)] text-white border-[var(--color-indigo)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl font-bold drop-shadow-md">{CREATE_QUIZ_TEXT.sectionTitle}</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <CreateQuizForm />
      </CardBody>
    </Card>
  );
}
