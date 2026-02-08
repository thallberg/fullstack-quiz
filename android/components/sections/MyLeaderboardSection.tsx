import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Spinner } from '../ui/Spinner';
import type { MyLeaderboardDto, QuizLeaderboardEntryDto } from '../../types';
import { colors } from '../../theme/colors';

export function MyLeaderboardSection() {
  const navigation = useNavigation<any>();
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

  const renderEntry = (entry: QuizLeaderboardEntryDto) => {
    const totalResults = entry.results?.length ?? 0;
    return (
      <TouchableOpacity
        key={entry.quizId}
        style={styles.navItem}
        onPress={() =>
          navigation.navigate('QuizLeaderboard', {
            quizId: entry.quizId,
            quizTitle: entry.quizTitle,
            results: entry.results ?? [],
          })
        }
        activeOpacity={0.75}
      >
        <View style={[styles.navDot, { backgroundColor: colors.yellow }]} />
        <View style={styles.navText}>
          <Text style={styles.navLabel}>{entry.quizTitle}</Text>
          <Text style={styles.navDesc}>
            {totalResults > 0 ? `${totalResults} resultat` : 'Inga resultat ännu'}
          </Text>
        </View>
        <Text style={styles.navChevron}>›</Text>
      </TouchableOpacity>
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

  return <View style={styles.wrapper}>{data.quizzes.map(renderEntry)}</View>;
}

const styles = StyleSheet.create({
  wrapper: { padding: 8, gap: 12 },
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500, padding: 16 },
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
