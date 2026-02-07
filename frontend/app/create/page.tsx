import { CreateQuizSection } from '@/components/sections/quiz/CreateQuizSection';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

export default function CreateQuizPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <CreateQuizSection />
      </div>
    </ProtectedRoute>
  );
}
