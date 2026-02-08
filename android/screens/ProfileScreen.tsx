import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { colors } from '../theme/colors';

function ProfileNavItem({
  label,
  description,
  color,
  onPress,
}: {
  label: string;
  description?: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.navDot, { backgroundColor: color }]} />
      <View style={styles.navText}>
        <Text style={styles.navLabel}>{label}</Text>
        {description ? <Text style={styles.navDesc}>{description}</Text> : null}
      </View>
      <Text style={styles.navChevron}>›</Text>
    </TouchableOpacity>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Min Profil</Text>
          <Text style={styles.subtitle}>Hantera din profil och dina quiz</Text>
        </View>
        <View style={styles.list}>
          <ProfileNavItem
            label="Min profil"
            description="Uppdatera dina uppgifter"
            color={colors.purple}
            onPress={() => navigation.navigate('ProfileDetails')}
          />
          <ProfileNavItem
            label="Mina quiz"
            description="Redigera och hantera dina quiz"
            color={colors.blue}
            onPress={() => navigation.navigate('MyQuizzes')}
          />
          <ProfileNavItem
            label="Vänner"
            description="Bjud in och hantera vänner"
            color={colors.orange}
            onPress={() => navigation.navigate('Friends')}
          />
          <ProfileNavItem
            label="Min leaderboard"
            description="Se dina topplistor"
            color={colors.yellow}
            onPress={() => navigation.navigate('MyLeaderboard')}
          />
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.purple,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: colors.gray500 },
  list: { gap: 12 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  navDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  navText: { flex: 1 },
  navLabel: { fontSize: 16, fontWeight: '600', color: colors.gray900 },
  navDesc: { fontSize: 13, color: colors.gray500, marginTop: 2 },
  navChevron: { fontSize: 20, color: colors.gray500 },
});
