import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type Variant = 'default' | 'info' | 'success' | 'warning' | 'secondary';

const variantBg: Record<Variant, string> = {
  default: colors.blue,
  info: colors.cyan,
  success: colors.green,
  warning: colors.yellow,
  secondary: colors.gray,
};

export function Badge({
  children,
  variant = 'default',
  style,
}: { children: React.ReactNode; variant?: Variant; style?: ViewStyle }) {
  return (
    <View style={[styles.badge, { backgroundColor: variantBg[variant] }, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
});
