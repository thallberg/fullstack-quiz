import React from 'react';
import { Switch as RNSwitch, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, label, disabled }: SwitchProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.gray200, true: colors.green }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 14, color: colors.gray700, flex: 1 },
});
