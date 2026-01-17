'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { ChangePasswordSection } from '@/components/sections/ChangePasswordSection';
import { UserQuizzesSection } from '@/components/sections/UserQuizzesSection';
import { FriendsSection } from '@/components/sections/FriendsSection';
import { Collapsible } from '@/components/ui/Collapsible';
import { useFriendshipNotifications } from '@/hooks/useFriendshipNotifications';

export default function ProfilePage() {
  const { hasPendingInvites } = useFriendshipNotifications();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-pink to-blue bg-clip-text text-transparent mb-2">
            Min Profil
          </h1>
          <p className="text-gray-500">Hantera din profil och dina quiz</p>
        </div>

        <Collapsible
          title="Min Profil"
          defaultOpen={true}
          className="border-purple-border/50 shadow-xl"
          headerClassName="bg-gradient-to-r from-purple to-pink text-white border-purple-dark"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <ProfileSection />
        </Collapsible>

        <Collapsible
          title="Ändra lösenord"
          className="border-blue-border/50 shadow-xl"
          headerClassName="bg-gradient-to-r from-blue to-indigo text-white border-blue-dark"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        >
          <ChangePasswordSection />
        </Collapsible>

        <Collapsible
          title="Mina Quiz"
          className="border-green-border/50 shadow-xl"
          headerClassName="bg-gradient-to-r from-green to-emerald text-white border-green-dark"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          <UserQuizzesSection />
        </Collapsible>

        <Collapsible
          title={
            <span className="flex items-center gap-2">
              Vänner
              {hasPendingInvites && (
                <span className="flex items-center justify-center w-6 h-6 bg-red text-white rounded-full text-sm font-bold animate-pulse">
                  !
                </span>
              )}
            </span>
          }
          defaultOpen={hasPendingInvites}
          className="border-orange-border/50 shadow-xl"
          headerClassName="bg-gradient-to-r from-orange to-pink text-white border-orange-dark"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          <FriendsSection />
        </Collapsible>
      </div>
    </ProtectedRoute>
  );
}
