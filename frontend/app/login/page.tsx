import { AuthForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex-1 flex items-center justify-center">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
