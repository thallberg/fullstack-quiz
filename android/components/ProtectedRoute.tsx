import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './ui/Spinner';
import { colors } from '../theme/colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

export function ProtectedRoute({ children, onRedirectToLogin }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onRedirectToLogin();
    }
  }, [isAuthenticated, isLoading, onRedirectToLogin]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: { fontSize: 16, color: colors.gray500 },
});
