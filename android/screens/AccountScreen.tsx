import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ChangePasswordSection } from '../components/sections/ChangePasswordSection';
import { Collapsible } from '../components/ui/Collapsible';
import { colors } from '../theme/colors';

export function AccountScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Konto</Text>
          <Text style={styles.subtitle}>Hantera ditt konto</Text>
        </View>
        <Collapsible title="Ändra lösenord" defaultOpen headerBg={colors.blue}>
          <ChangePasswordSection />
        </Collapsible>
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
