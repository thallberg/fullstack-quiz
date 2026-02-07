'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { EditQuizSection } from '@/components/sections/quiz/EditQuizSection';

export default function EditQuizPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string, 10);

  if (isNaN(quizId)) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Ogiltigt quiz-ID</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="w-full max-w-6xl mx-auto px-0 sm:px-4 lg:px-6 py-4 sm:py-8">
        <EditQuizSection quizId={quizId} />
      </div>
    </ProtectedRoute>
  );
}
