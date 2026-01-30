import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

export function Label({
  children,
  style,
  required,
}: { children: React.ReactNode; style?: TextStyle; required?: boolean }) {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: 6,
  },
  required: { color: colors.red },
});
