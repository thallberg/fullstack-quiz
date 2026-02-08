import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { quizDataSource } from '../lib/data';
import type { QuizResultDetailsDto } from '../types';
import { colors } from '../theme/colors';

type RouteParams = { resultId: number; quizId?: number; quizTitle?: string };

export function QuizResultDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { resultId } = (route.params ?? {}) as RouteParams;
  const [details, setDetails] = useState<QuizResultDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDetails();
  }, [resultId]);

  const loadDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      if (!resultId) {
        setError('Resultat saknas');
        return;
      }
      const data = await quizDataSource.getQuizResultDetails(resultId);
      setDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda resultat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        {isLoading ? (
          <View style={styles.centered}>
            <Spinner size="lg" />
            <Text style={styles.loadingText}>Laddar...</Text>
          </View>
        ) : (
          <>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {details ? (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>{details.quizTitle}</Text>
                  <Text style={styles.subtitle}>Resultat för {details.username}</Text>
                  <View style={styles.summary}>
                    <Badge variant="success">{details.percentage}%</Badge>
                    <Badge variant="default">
                      {details.score}/{details.totalQuestions}
                    </Badge>
                  </View>
                </View>
                <View style={styles.list}>
                  {details.questions.map((q, index) => (
                    <Card key={q.questionId} style={styles.card}>
                      <CardBody style={styles.cardBody}>
                        <View style={styles.questionHeader}>
                          <Text style={styles.questionNumber}>{index + 1}.</Text>
                          <Text style={styles.questionText}>{q.questionText}</Text>
                        </View>
                        <View style={styles.answers}>
                          <Text
                            style={[
                              styles.answerLabel,
                          q.userAnswer == null ? styles.neutral : q.isCorrect ? styles.correct : styles.wrong,
                            ]}
                          >
                            Ditt svar: {q.userAnswer == null ? '–' : q.userAnswer ? 'Ja' : 'Nej'}
                            {q.userAnswer != null ? (q.isCorrect ? ' ✓' : ' ✗') : ''}
                          </Text>
                          <Text style={styles.answerLabel}>Rätt svar: {q.correctAnswer ? 'Ja' : 'Nej'}</Text>
                        </View>
                      </CardBody>
                    </Card>
                  ))}
                </View>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, marginBottom: 12, textAlign: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: colors.purple, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.gray500, marginTop: 6, textAlign: 'center' },
  summary: { flexDirection: 'row', gap: 8, marginTop: 12 },
  list: { gap: 12 },
  card: { borderColor: colors.gray200 },
  cardBody: { padding: 16 },
  questionHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  questionNumber: { fontWeight: '700', color: colors.gray900 },
  questionText: { flex: 1, fontWeight: '600', color: colors.gray900 },
  answers: { gap: 4 },
  answerLabel: { fontSize: 13, color: colors.gray500 },
  neutral: { color: colors.gray500 },
  correct: { color: colors.green },
  wrong: { color: colors.red },
});
