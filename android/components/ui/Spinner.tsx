import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type Size = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: Size;
  style?: ViewStyle;
  color?: string;
}

const sizeMap = { sm: 'small', md: 'small', lg: 'large' } as const;

export function Spinner({ size = 'md', style, color = colors.blue }: SpinnerProps) {
  return (
    <View style={[styles.wrapper, size === 'lg' && styles.wrapperLg, style]}>
      <ActivityIndicator
        size={sizeMap[size]}
        color={color}
        style={size === 'lg' ? { transform: [{ scale: 1.5 }] } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperLg: {
    padding: 8,
  },
});
