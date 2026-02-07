import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { CreateQuizForm } from './CreateQuizFormClient';

export function CreateQuizSection() {
  return (
    <Card className="border-[var(--color-indigo)]/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-purple)] text-white border-[var(--color-indigo)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl font-bold drop-shadow-md">Skapa nytt Quiz</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <CreateQuizForm />
      </CardBody>
    </Card>
  );
}
