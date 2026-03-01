'use client';

import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { ChangePasswordSection } from '@/components/sections/user/ChangePasswordSection';
import { Collapsible } from '@/components/ui/Collapsible';
import { useContent } from '@/contexts/LocaleContext';

export default function AccountPage() {
  const { ACCOUNT_PAGE_TEXT } = useContent();

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-pink to-blue bg-clip-text text-transparent mb-2">
            {ACCOUNT_PAGE_TEXT.title}
          </h1>
          <p className="text-gray-500">{ACCOUNT_PAGE_TEXT.description}</p>
        </div>
        
        <Collapsible
          title={ACCOUNT_PAGE_TEXT.changePasswordTitle}
          defaultOpen={true}
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
      </div>
    </ProtectedRoute>
  );
}
