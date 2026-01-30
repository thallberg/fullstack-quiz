import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { quizDataSource } from '../../lib/data';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { Collapsible } from '../ui/Collapsible';
import type { LeaderboardDto, QuizLeaderboardEntryDto, QuizResultEntryDto } from '../../types';
import { colors } from '../../theme/colors';

export function LeaderboardSection() {
  const [data, setData] = useState<LeaderboardDto>({
    myQuizzes: [],
    friendsQuizzes: [],
    publicQuizzes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await quizDataSource.getLeaderboard();
      setData({
        myQuizzes: result?.myQuizzes ?? [],
        friendsQuizzes: result?.friendsQuizzes ?? [],
        publicQuizzes: result?.publicQuizzes ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMedal = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `${pos}.`;
  };

  const renderResult = (result: QuizResultEntryDto, position: number) => (
    <View key={result.resultId} style={styles.resultRow}>
      <Text style={styles.medal}>{getMedal(position)}</Text>
      <Text style={styles.username}>{result.username}</Text>
      <Badge variant="success">{result.percentage}%</Badge>
      <Badge variant="default">{result.score}/{result.totalQuestions}</Badge>
    </View>
  );

  const renderQuizEntry = (entry: QuizLeaderboardEntryDto) => {
    const sorted = [...(entry.results ?? [])].sort((a, b) => b.percentage - a.percentage);
    return (
      <View key={entry.quizId} style={styles.quizEntry}>
        <Text style={styles.quizTitle}>{entry.quizTitle}</Text>
        {sorted.slice(0, 5).map((r, i) => renderResult(r, i + 1))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar leaderboard...</Text>
      </View>
    );
  }
  if (error) return <Text style={styles.error}>{error}</Text>;

  const hasAny =
    (data.myQuizzes?.length ?? 0) +
    (data.friendsQuizzes?.length ?? 0) +
    (data.publicQuizzes?.length ?? 0) >
    0;

  if (!hasAny) {
    return <Text style={styles.empty}>Inga resultat ännu</Text>;
  }

  return (
    <View style={styles.wrapper}>
      {data.myQuizzes?.length ? (
        <Collapsible title="Mina quiz" defaultOpen headerBg={colors.blue}>
          {data.myQuizzes.map(renderQuizEntry)}
        </Collapsible>
      ) : null}
      {data.friendsQuizzes?.length ? (
        <Collapsible title="Vänners quiz" headerBg={colors.green}>
          {data.friendsQuizzes.map(renderQuizEntry)}
        </Collapsible>
      ) : null}
      {data.publicQuizzes?.length ? (
        <Collapsible title="Publika quiz" headerBg={colors.purple}>
          {data.publicQuizzes.map(renderQuizEntry)}
        </Collapsible>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8 },
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500, padding: 16 },
  quizEntry: { marginBottom: 16 },
  quizTitle: { fontSize: 16, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 4,
  },
  medal: { fontSize: 16, fontWeight: '700' },
  username: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.gray700 },
});
