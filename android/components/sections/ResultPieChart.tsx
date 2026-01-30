import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ResultPieChartProps {
  correct: number;
  total: number;
  size?: number;
}

export function ResultPieChart({ correct, total, size = 200 }: ResultPieChartProps) {
  const safeTotal = Math.max(total, 1);
  const wrong = safeTotal - correct;
  const pct = Math.round((correct / safeTotal) * 100);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.percent, { fontSize: size * 0.22 }]}>{pct}%</Text>
        <Text style={[styles.fraction, { fontSize: size * 0.12 }]}>{correct}/{total}</Text>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.green }]} />
          <Text style={styles.legendText}><Text style={styles.bold}>{correct}</Text> rätt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.red }]} />
          <Text style={styles.legendText}><Text style={styles.bold}>{wrong}</Text> fel</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 16 },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 14,
    borderColor: colors.green,
    backgroundColor: colors.gray50,
  },
  percent: { fontWeight: '700', color: colors.gray900 },
  fraction: { marginTop: 4, color: colors.gray500 },
  legend: { flexDirection: 'row', gap: 24, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 14, color: colors.gray700 },
  bold: { fontWeight: '700' },
});
