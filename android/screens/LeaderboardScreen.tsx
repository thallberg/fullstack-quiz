import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LeaderboardSection } from '../components/sections/LeaderboardSection';
import { colors } from '../theme/colors';

export function LeaderboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard 🏆</Text>
          <Text style={styles.subtitle}>Se bästa resultaten på dina quiz och dina vänners quiz</Text>
        </View>
        <LeaderboardSection />
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.purple,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: colors.gray500 },
});
