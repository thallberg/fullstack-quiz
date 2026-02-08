import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import type { QuizResponseDto } from '../../types';
import { colors } from '../../theme/colors';

export function UserQuizzesSection() {
  const navigation = useNavigation<any>();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [])
  );

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await quizDataSource.getMyQuizzes();
      setQuizzes(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
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
  if (quizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Inga quiz ännu</Text>
        <Button variant="primary" onPress={() => navigation.navigate('Create')} style={styles.mt}>
          Skapa quiz
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {quizzes.map((quiz) => (
        <TouchableOpacity
          key={quiz.id}
          style={styles.navItem}
          onPress={() => navigation.navigate('MyQuizDetails', { quizId: quiz.id })}
          activeOpacity={0.75}
        >
          <View style={[styles.navDot, { backgroundColor: colors.blue }]} />
          <View style={styles.navText}>
            <Text style={styles.navLabel}>{quiz.title}</Text>
            <Text style={styles.navDesc}>
              {quiz.description ? quiz.description : `${quiz.questions?.length ?? 0} frågor`}
            </Text>
          </View>
          <Text style={styles.navChevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500 },
  mt: { marginTop: 12 },
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
