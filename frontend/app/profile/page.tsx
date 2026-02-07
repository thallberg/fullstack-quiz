'use client';

import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { ProfileSection } from '@/components/sections/user/ProfileSection';
import { UserQuizzesSection } from '@/components/sections/user/UserQuizzesSection';
import { FriendsSection } from '@/components/sections/user/FriendsSection';
import { MyLeaderboardSection } from '@/components/sections/user/MyLeaderboardSection';
import { Collapsible } from '@/components/ui/Collapsible';
import { useFriendshipNotifications } from '@/hooks/useFriendshipNotifications';

export default function ProfilePage() {
  const { hasPendingInvites } = useFriendshipNotifications();

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-purple)] via-[var(--color-pink)] to-[var(--color-blue)] bg-clip-text text-transparent mb-2">
            Min Profil
          </h1>
          <p className="text-gray-500">Hantera din profil och dina quiz</p>
        </div>

        <div id="min-profil">
          <Collapsible
            title="Min Profil"
            defaultOpen={true}
            className="border-[var(--color-purple)]/50 shadow-xl"
            headerClassName="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)]"
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <ProfileSection />
          </Collapsible>
        </div>

        <div id="mina-quiz">
          <Collapsible
            title="Mina Quiz"
            className="border-[var(--color-green)]/50 shadow-xl"
            headerClassName="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)]"
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <UserQuizzesSection />
          </Collapsible>
        </div>

        <div id="vanner">
          <Collapsible
            title={
              <span className="flex items-center gap-2">
                Vänner
                {hasPendingInvites && (
                  <span className="flex items-center justify-center w-6 h-6 bg-[var(--color-red)] text-white rounded-full text-sm font-bold animate-pulse">
                    !
                  </span>
                )}
              </span>
            }
            defaultOpen={hasPendingInvites}
            className="border-[var(--color-orange)]/50 shadow-xl"
            headerClassName="bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-pink)] text-white border-[var(--color-orange)]"
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          >
            <FriendsSection />
          </Collapsible>
        </div>

        <div id="min-leaderboard">
          <Collapsible
            title="Min Leaderboard"
            className="border-[var(--color-yellow)]/50 shadow-xl"
            headerClassName="bg-gradient-to-r from-[var(--color-yellow)] to-[var(--color-orange)] text-white border-[var(--color-yellow)]"
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          >
            <MyLeaderboardSection />
          </Collapsible>
        </div>
      </div>
    </ProtectedRoute>
  );
}
