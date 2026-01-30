import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { colors } from '../theme/colors';

export function SettingsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Inställningar</Text>
          <Text style={styles.subtitle}>Hantera dina inställningar</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.placeholder}>Innehåll kommer snart...</Text>
        </View>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholder: { fontSize: 16, color: colors.gray500 },
});
