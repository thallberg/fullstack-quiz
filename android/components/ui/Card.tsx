import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';

export function Card({
  children,
  style,
}: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({
  children,
  style,
  gradient,
}: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gradient?: [string, string] }) {
  return (
    <View
      style={[
        styles.header,
        gradient && { backgroundColor: gradient[0] },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={styles.headerText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function CardBody({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.body, style]}>{children}</View>;
}

export function CardFooter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.purple,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  body: {
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray900,
  },
});
