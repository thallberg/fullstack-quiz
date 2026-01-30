import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { WelcomeSection } from '../components/sections/WelcomeSection';
import { LoggedInWelcomeSection } from '../components/sections/LoggedInWelcomeSection';
import { Spinner } from '../components/ui/Spinner';
import { colors } from '../theme/colors';

export function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <WelcomeSection />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <LoggedInWelcomeSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: { fontSize: 16, color: colors.gray500 },
});
