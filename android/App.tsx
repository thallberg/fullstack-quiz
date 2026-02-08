import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { CreateQuizDraftProvider } from './contexts/CreateQuizContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CreateQuizDraftProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </CreateQuizDraftProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
