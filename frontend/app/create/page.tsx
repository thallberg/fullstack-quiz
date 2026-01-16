import { CreateQuizSection } from '@/components/sections/CreateQuizSection';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CreateQuizPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <CreateQuizSection />
      </div>
    </ProtectedRoute>
  );
}
