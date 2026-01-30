import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';

export function Textarea({
  style,
  placeholderTextColor = colors.gray500,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      placeholderTextColor={placeholderTextColor}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
});
