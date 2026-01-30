import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

function NavItem({
  label,
  onPress,
  active,
}: { label: string; onPress: () => void; active?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.navItem, active && styles.navItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AppDrawerContent(props: any) {
  const { isAuthenticated, user, logout } = useAuth();
  const nav = props.navigation;
  const go = (screen: string) => {
    nav.closeDrawer();
    nav.navigate('Main', { screen });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
      {isAuthenticated && user ? (
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.greeting}>Hej, {user.username}</Text>
        </View>
      ) : null}
      <View style={styles.nav}>
        {isAuthenticated ? (
          <>
            <NavItem label="Hem" onPress={() => go('Home')} />
            <NavItem label="Alla quiz" onPress={() => go('QuizList')} />
            <NavItem label="Skapa Quiz" onPress={() => go('Create')} />
            <NavItem label="Leaderboard" onPress={() => go('Leaderboard')} />
            <NavItem label="Min Profil" onPress={() => go('Profile')} />
            <NavItem label="Konto" onPress={() => go('Account')} />
            <NavItem label="Inställningar" onPress={() => go('Settings')} />
          </>
        ) : (
          <>
            <NavItem label="Logga in" onPress={() => go('Login')} />
            <NavItem label="Registrera" onPress={() => go('Register')} />
          </>
        )}
      </View>
      {isAuthenticated ? (
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            nav.closeDrawer();
            nav.navigate('Main', { screen: 'Home' });
          }}
        >
          <Text style={styles.logoutText}>Logga ut</Text>
        </TouchableOpacity>
      ) : null}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 8 },
  nav: { paddingHorizontal: 8, paddingVertical: 8 },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: { backgroundColor: colors.purple + '20' },
  navText: { fontSize: 16, color: colors.gray700 },
  navTextActive: { color: colors.purple, fontWeight: '600' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: colors.white },
  greeting: { fontSize: 14, color: colors.gray700 },
  logoutBtn: {
    padding: 16,
    marginHorizontal: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  logoutText: { fontSize: 16, color: colors.gray700, fontWeight: '500' },
});
