import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <RegisterForm />
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
