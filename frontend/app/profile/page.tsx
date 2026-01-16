'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { ChangePasswordSection } from '@/components/sections/ChangePasswordSection';
import { UserQuizzesSection } from '@/components/sections/UserQuizzesSection';
import { Collapsible } from '@/components/ui/Collapsible';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Min Profil
          </h1>
          <p className="text-gray-600">Hantera din profil och dina quiz</p>
        </div>

        <Collapsible
          title="Min Profil"
          defaultOpen={true}
          className="border-purple-400 shadow-xl"
          headerClassName="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700"
          icon={
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <ProfileSection />
        </Collapsible>

        <Collapsible
          title="Ändra lösenord"
          className="border-blue-400 shadow-xl"
          headerClassName="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700"
          icon={
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        >
          <ChangePasswordSection />
        </Collapsible>

        <Collapsible
          title="Mina Quiz"
          className="border-green-400 shadow-xl"
          headerClassName="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700"
          icon={
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          <UserQuizzesSection />
        </Collapsible>
      </div>
    </ProtectedRoute>
  );
}
