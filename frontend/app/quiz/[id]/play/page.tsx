import { PlayQuizSection } from '@/components/sections/PlayQuizSection';

interface PlayQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayQuizPage({ params }: PlayQuizPageProps) {
  const { id } = await params;
  const quizId = parseInt(id, 10);

  if (isNaN(quizId)) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-red-600">Ogiltigt quiz-ID</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <PlayQuizSection quizId={quizId} />
    </div>
  );
}
