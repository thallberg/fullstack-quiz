'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LeaderboardSection } from '@/components/sections/LeaderboardSection';

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-pink to-blue bg-clip-text text-transparent mb-2">
            Leaderboard 🏆
          </h1>
          <p className="text-gray-500">Se bästa resultaten på dina quiz och dina vänners quiz</p>
        </div>
        <LeaderboardSection />
      </div>
    </ProtectedRoute>
  );
}
