import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import type { QuizResultEntryDto } from '../types';
import { colors } from '../theme/colors';

type RouteParams = {
  quizId: number;
  quizTitle: string;
  results: QuizResultEntryDto[];
};

export function QuizLeaderboardScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params ?? {}) as RouteParams;
  const results = params.results ?? [];
  const sorted = [...results].sort((a, b) => b.percentage - a.percentage);

  const getMedal = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `${pos}.`;
  };

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.quizTitle ?? 'Quiz leaderboard'}</Text>
          <Text style={styles.subtitle}>Topplista för detta quiz</Text>
        </View>
        {sorted.length === 0 ? (
          <Text style={styles.empty}>Inga resultat ännu</Text>
        ) : (
          <View style={styles.list}>
            {sorted.map((result, index) => (
              <Card key={result.resultId} style={styles.card}>
                <CardBody style={styles.cardBody}>
                  <View style={styles.row}>
                    <Text style={styles.medal}>{getMedal(index + 1)}</Text>
                    <Text style={styles.username}>{result.username}</Text>
                    <Badge variant="success">{result.percentage}%</Badge>
                    <Badge variant="default">
                      {result.score}/{result.totalQuestions}
                    </Badge>
                  </View>
                </CardBody>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.purple, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.gray500, textAlign: 'center' },
  empty: { textAlign: 'center', color: colors.gray500, marginTop: 24 },
  list: { gap: 12 },
  card: { borderColor: colors.gray200 },
  cardBody: { padding: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medal: { fontSize: 16, fontWeight: '700' },
  username: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.gray700 },
});
