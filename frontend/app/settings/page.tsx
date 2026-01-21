'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-pink to-blue bg-clip-text text-transparent mb-2">
            Inställningar
          </h1>
          <p className="text-gray-500">Hantera dina inställningar</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Innehåll kommer snart...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
