import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'default' | 'ghost';
type Size = 'default' | 'sm' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<Variant, { bg: string; border?: string }> = {
  primary: { bg: colors.blue },
  secondary: { bg: colors.purple },
  outline: { bg: 'transparent', border: colors.blue },
  danger: { bg: colors.red },
  default: { bg: colors.gray },
  ghost: { bg: 'transparent' },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  isLoading = false,
  style,
  textStyle,
}: ButtonProps) {
  const v = variantStyles[variant];
  const isOutline = variant === 'outline' || variant === 'ghost';
  const textColor = isOutline ? colors.gray900 : colors.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { backgroundColor: v.bg, borderWidth: v.border ? 1 : 0, borderColor: v.border },
        size === 'sm' && styles.sm,
        size === 'lg' && styles.lg,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.textSm, size === 'lg' && styles.textLg, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 40,
  },
  sm: { paddingVertical: 6, paddingHorizontal: 12, minHeight: 36 },
  lg: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 44 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 14, fontWeight: '600' },
  textSm: { fontSize: 12 },
  textLg: { fontSize: 16 },
});
