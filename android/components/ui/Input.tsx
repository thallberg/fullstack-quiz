import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export function Input({
  style,
  placeholderTextColor = colors.gray500,
  ...props
}: TextInputProps & { style?: ViewStyle }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
});
