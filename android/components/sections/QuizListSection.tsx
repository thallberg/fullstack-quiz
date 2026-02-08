import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import type { QuizResponseDto } from '../../types';
import { colors } from '../../theme/colors';

export function QuizListSection() {
  const navigation = useNavigation<any>();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await quizDataSource.getAllQuizzes();
      const combined = [
        ...(data?.myQuizzes ?? []),
        ...(data?.friendsQuizzes ?? []),
        ...(data?.publicQuizzes ?? []),
      ];
      const sorted = combined.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setQuizzes(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuizCards = (quizzes: QuizResponseDto[]) => {
    if (!quizzes.length) return null;
    return quizzes.map((quiz) => {
      return (
        <Card key={quiz.id} style={[styles.quizCard, { borderColor: colors.blue + '80' }]}>
          <CardBody style={styles.quizBody}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            {quiz.description ? (
              <Text style={styles.quizDesc} numberOfLines={2}>{quiz.description}</Text>
            ) : null}
            <Text style={styles.meta}>
              Skapad av {quiz.username} • {quiz.questions?.length ?? 0} frågor
            </Text>
          </CardBody>
          <CardFooter style={styles.quizFooter}>
            <Button
              variant="primary"
              onPress={() => navigation.navigate('QuizPlay', { quizId: quiz.id })}
              style={styles.playButton}
            >
              Spela
            </Button>
          </CardFooter>
        </Card>
      );
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar quiz...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (quizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Inga quiz hittades</Text>
        <Button variant="primary" onPress={() => navigation.navigate('Create')} style={styles.mt}>
          Skapa första quizet
        </Button>
      </View>
    );
  }

  return (
    <>
      <View style={styles.list}>{renderQuizCards(quizzes)}</View>
    </>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  errorBox: {
    padding: 16,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.red + '80',
    borderRadius: 8,
    margin: 16,
  },
  errorText: { color: colors.red },
  emptyText: { fontSize: 16, color: colors.gray500 },
  mt: { marginTop: 16 },
  list: { gap: 12 },
  quizCard: { marginBottom: 12 },
  quizBody: { padding: 12 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: colors.gray900, marginBottom: 4 },
  quizDesc: { fontSize: 14, color: colors.gray500, marginBottom: 8 },
  meta: { fontSize: 13, color: colors.gray500 },
  quizFooter: { padding: 12 },
  playButton: { width: '100%' },
});
