'use client';

import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { useContent } from '@/contexts/LocaleContext';

export default function SettingsPage() {
  const { SETTINGS_PAGE_TEXT } = useContent();

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-pink to-blue bg-clip-text text-transparent mb-2">
            {SETTINGS_PAGE_TEXT.title}
          </h1>
          <p className="text-gray-500">{SETTINGS_PAGE_TEXT.description}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">{SETTINGS_PAGE_TEXT.comingSoon}</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
