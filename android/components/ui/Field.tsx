import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export function FieldGroup({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function Field({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.field, style]}>{children}</View>;
}

export function FieldLabel({ children, style, required }: { children: React.ReactNode; style?: ViewStyle; required?: boolean }) {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

export function FieldError({ errors, style }: { errors?: string | string[]; style?: ViewStyle }) {
  const msg = Array.isArray(errors) ? errors[0] : typeof errors === 'string' ? errors : null;
  if (!msg) return null;
  return <Text style={[styles.error, style]}>{msg}</Text>;
}

const styles = StyleSheet.create({
  group: { gap: 20 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  required: { color: colors.red },
  error: { fontSize: 12, fontWeight: '500', color: colors.red },
});
