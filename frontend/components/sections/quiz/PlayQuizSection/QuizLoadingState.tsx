import { Spinner } from '@/components/ui/Spinner';
import { useContent } from '@/contexts/LocaleContext';

export function QuizLoadingState() {
  const { PLAY_QUIZ_TEXT } = useContent();

  return (
    <div className="flex flex-col justify-center items-center py-12 gap-4">
      <Spinner size="lg" className="border-blue" />
      <p className="text-gray-500">{PLAY_QUIZ_TEXT.loading}</p>
    </div>
  );
}
