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
      <View style={styles.container}>
        <View style={styles.nav}>
          {isAuthenticated ? (
            <>
              <NavItem label="Hem" onPress={() => go('Home')} />
              <NavItem label="Alla quiz" onPress={() => go('QuizList')} />
              <NavItem label="Skapa quiz" onPress={() => go('Create')} />
              <NavItem label="Leaderboard" onPress={() => go('Leaderboard')} />
            </>
          ) : (
            <>
              <NavItem label="Logga in" onPress={() => go('Login')} />
              <NavItem label="Registrera" onPress={() => go('Register')} />
            </>
          )}
        </View>
        {isAuthenticated && user ? (
          <View style={styles.footer}>
            <View style={styles.divider} />
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.profileName}>{user.username}</Text>
            </View>
            <View style={styles.footerNav}>
              <NavItem label="Min profil" onPress={() => go('Profile')} />
              <NavItem label="Konto" onPress={() => go('Account')} />
              <NavItem label="Inställningar" onPress={() => go('Settings')} />
            </View>
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
          </View>
        ) : null}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingTop: 8, paddingBottom: 16 },
  container: { flex: 1, justifyContent: 'space-between' },
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
  footer: { paddingHorizontal: 8, paddingBottom: 4 },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: colors.white },
  profileName: { fontSize: 16, fontWeight: '600', color: colors.gray900 },
  footerNav: { paddingHorizontal: 8, paddingBottom: 4 },
  logoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: colors.gray50,
  },
  logoutText: { fontSize: 16, color: colors.gray700, fontWeight: '500' },
});
