import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { FriendsSection } from '../components/sections/FriendsSection';
import { colors } from '../theme/colors';

export function FriendsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mina vänner</Text>
          <Text style={styles.subtitle}>Bjud in, acceptera och hantera vänner</Text>
        </View>
        <FriendsSection />
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.orange, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.gray500, textAlign: 'center' },
});
