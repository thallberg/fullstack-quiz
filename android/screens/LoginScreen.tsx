import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <LoginForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingVertical: 32,
  },
});
