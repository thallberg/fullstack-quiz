import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Spinner } from '../ui/Spinner';
import type { LeaderboardDto, QuizLeaderboardEntryDto, QuizResponseDto } from '../../types';
import { colors } from '../../theme/colors';

export function LeaderboardSection() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<LeaderboardDto>({
    myQuizzes: [],
    friendsQuizzes: [],
    publicQuizzes: [],
  });
  const [creatorById, setCreatorById] = useState<Record<number, string>>({});
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
      try {
        const all = await quizDataSource.getAllQuizzes();
        const combined: QuizResponseDto[] = [
          ...(all?.myQuizzes ?? []),
          ...(all?.friendsQuizzes ?? []),
          ...(all?.publicQuizzes ?? []),
        ];
        const map: Record<number, string> = {};
        combined.forEach((quiz) => {
          if (quiz?.id && quiz.username) {
            map[quiz.id] = quiz.username;
          }
        });
        setCreatorById(map);
      } catch {
        setCreatorById({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenQuiz = (entry: QuizLeaderboardEntryDto) => {
    navigation.navigate('QuizLeaderboard', {
      quizId: entry.quizId,
      quizTitle: entry.quizTitle,
      results: entry.results ?? [],
    });
  };

  const renderQuizItem = (entry: QuizLeaderboardEntryDto, color: string, showCreator?: boolean) => {
    const totalResults = entry.results?.length ?? 0;
    const creator = creatorById[entry.quizId];
    const descParts: string[] = [];
    if (showCreator && creator) {
      descParts.push(`Skapad av ${creator}`);
    }
    descParts.push(totalResults > 0 ? `${totalResults} resultat` : 'Inga resultat ännu');
    return (
      <TouchableOpacity
        key={entry.quizId}
        style={styles.navItem}
        onPress={() => handleOpenQuiz(entry)}
        activeOpacity={0.75}
      >
        <View style={[styles.navDot, { backgroundColor: color }]} />
        <View style={styles.navText}>
          <Text style={styles.navLabel}>{entry.quizTitle}</Text>
          <Text style={styles.navDesc}>{descParts.join(' • ')}</Text>
        </View>
        <Text style={styles.navChevron}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderGroup = (
    title: string,
    items: QuizLeaderboardEntryDto[],
    color: string,
    showCreator?: boolean
  ) => {
    if (!items.length) return null;
    return (
      <View style={styles.group}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.groupList}>
          {items.map((entry) => renderQuizItem(entry, color, showCreator))}
        </View>
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
      {renderGroup('Mina quiz', data.myQuizzes ?? [], colors.blue)}
      {renderGroup('Vänners quiz', data.friendsQuizzes ?? [], colors.green, true)}
      {renderGroup('Publika quiz', data.publicQuizzes ?? [], colors.purple)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8, gap: 16 },
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500, padding: 16 },
  group: { gap: 10 },
  groupTitle: { fontSize: 16, fontWeight: '700', color: colors.gray900 },
  groupList: { gap: 12 },
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
