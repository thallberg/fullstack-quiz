import { ProtectedRoute } from '@/components/ProtectedRoute';
import { QuizListSection } from '@/components/sections/QuizListSection';

export default function QuizzesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] bg-clip-text text-transparent">
            Alla quiz
          </h1>
          <p className="text-gray-500 mt-2">Spela dina egna och andra användares quiz</p>
        </div>
        <QuizListSection />
      </div>
    </ProtectedRoute>
  );
}
