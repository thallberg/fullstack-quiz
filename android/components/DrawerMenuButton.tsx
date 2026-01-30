import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native'; // open drawer
import { colors } from '../theme/colors';

export function DrawerMenuButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.btn}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.icon}>☰</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginLeft: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 24, color: colors.white, fontWeight: '700' },
});
