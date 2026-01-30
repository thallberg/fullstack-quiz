import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { quizDataSource } from '../../lib/data';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import type { MyLeaderboardDto, QuizLeaderboardEntryDto, QuizResultEntryDto } from '../../types';
import { colors } from '../../theme/colors';

export function MyLeaderboardSection() {
  const [data, setData] = useState<MyLeaderboardDto>({ quizzes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await quizDataSource.getMyLeaderboard();
      if (result) setData({ quizzes: result.quizzes ?? [] });
      else setData({ quizzes: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda');
      setData({ quizzes: [] });
    } finally {
      setIsLoading(false);
    }
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
    </View>
  );

  const renderEntry = (entry: QuizLeaderboardEntryDto) => {
    const sorted = [...(entry.results ?? [])].sort((a, b) => b.percentage - a.percentage);
    return (
      <View key={entry.quizId} style={styles.entry}>
        <Text style={styles.quizTitle}>{entry.quizTitle}</Text>
        {sorted.slice(0, 5).map((r, i) => renderResult(r, i + 1))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar...</Text>
      </View>
    );
  }
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!data.quizzes?.length) return <Text style={styles.empty}>Inga resultat ännu</Text>;

  return (
    <View style={styles.wrapper}>
      {data.quizzes.map(renderEntry)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8 },
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500, padding: 16 },
  entry: { marginBottom: 16 },
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
  username: { flex: 1, fontSize: 14, color: colors.gray700 },
});
