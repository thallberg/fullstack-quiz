import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Card, CardHeader, CardBody } from './Card';
import { colors } from '../../theme/colors';

interface CollapsibleProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  headerBg?: string;
  icon?: React.ReactNode;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  style,
  headerStyle,
  headerBg = colors.purple,
  icon,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card style={[styles.card, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, { backgroundColor: headerBg }, headerStyle]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {icon}
            {typeof title === 'string' ? (
              <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            ) : (
              <View style={{ flex: 1 }}>{title}</View>
            )}
          </View>
          <Text style={styles.chevron}>{isOpen ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.body}>
          <CardBody style={styles.bodyInner}>{children}</CardBody>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', marginVertical: 8 },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.white, flex: 1 },
  chevron: { fontSize: 12, color: colors.white },
  body: {},
  bodyInner: { paddingVertical: 8, paddingHorizontal: 12 },
});
