import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ProfileSection } from '../components/sections/ProfileSection';
import { UserQuizzesSection } from '../components/sections/UserQuizzesSection';
import { FriendsSection } from '../components/sections/FriendsSection';
import { MyLeaderboardSection } from '../components/sections/MyLeaderboardSection';
import { Collapsible } from '../components/ui/Collapsible';
import { colors } from '../theme/colors';

export function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Min Profil</Text>
          <Text style={styles.subtitle}>Hantera din profil och dina quiz</Text>
        </View>
        <Collapsible title="Min Profil" defaultOpen headerBg={colors.purple}>
          <ProfileSection />
        </Collapsible>
        <Collapsible title="Mina Quiz" headerBg={colors.green}>
          <UserQuizzesSection />
        </Collapsible>
        <Collapsible title="Vänner" headerBg={colors.orange}>
          <FriendsSection />
        </Collapsible>
        <Collapsible title="Min Leaderboard" headerBg={colors.yellow}>
          <MyLeaderboardSection />
        </Collapsible>
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
});
