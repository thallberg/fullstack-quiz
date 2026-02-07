import { Spinner } from '@/components/ui/Spinner';

export function QuizLoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-12 gap-4">
      <Spinner size="lg" className="border-blue" />
      <p className="text-gray-500">Laddar quiz...</p>
    </div>
  );
}
