import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { QuizListSection } from '../components/sections/QuizListSection';

export function QuizListScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <QuizListSection />
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
});
