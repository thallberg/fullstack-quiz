import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/Spinner';
import { quizDataSource } from '../lib/data';
import type { QuizResponseDto } from '../types';
import { colors } from '../theme/colors';

type RouteParams = { quizId: number };

export function MyQuizDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { quizId } = (route.params ?? {}) as RouteParams;
  const [quiz, setQuiz] = useState<QuizResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      setError('');
      if (!quizId) {
        setError('Quiz saknas');
        return;
      }
      const data = await quizDataSource.getQuizById(quizId);
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await quizDataSource.deleteQuiz(quizId);
      setDeleteDialog(false);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort quiz');
      setDeleteDialog(false);
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
            {quiz ? (
              <Card style={styles.card}>
                <CardBody style={styles.cardBody}>
                  <Text style={styles.title}>{quiz.title}</Text>
                  {quiz.description ? <Text style={styles.desc}>{quiz.description}</Text> : null}
                  <Text style={styles.meta}>{quiz.questions?.length ?? 0} frågor</Text>
                </CardBody>
              </Card>
            ) : null}
            <View style={styles.actions}>
              <Button size="lg" onPress={() => navigation.navigate('QuizPlay', { quizId })} style={styles.actionButton}>
                Spela
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onPress={() => navigation.navigate('QuizEdit', { quizId })}
                style={styles.actionButton}
              >
                Redigera
              </Button>
              <Button size="lg" variant="danger" onPress={() => setDeleteDialog(true)} style={styles.actionButton}>
                Ta bort
              </Button>
            </View>
            <ConfirmDialog
              isOpen={deleteDialog}
              title="Ta bort quiz"
              message={`Ta bort "${quiz?.title ?? ''}"?`}
              confirmText="Ta bort"
              cancelText="Avbryt"
              variant="danger"
              onConfirm={handleDelete}
              onCancel={() => setDeleteDialog(false)}
            />
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
  card: { borderColor: colors.blue + '60', marginBottom: 24 },
  cardBody: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.gray900, textAlign: 'center' },
  desc: { fontSize: 14, color: colors.gray500, marginTop: 8, textAlign: 'center' },
  meta: { fontSize: 14, color: colors.gray500, marginTop: 12 },
  actions: { gap: 12 },
  actionButton: { width: '100%' },
});
