import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
import type { QuizResponseDto } from '../../types';
import { colors } from '../../theme/colors';

export function UserQuizzesSection() {
  const navigation = useNavigation<any>();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    quizId: number | null;
    quizTitle: string;
  }>({ isOpen: false, quizId: null, quizTitle: '' });

  useEffect(() => {
    loadQuizzes();
  }, []);

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

  const openDelete = (id: number, title: string) => {
    setDeleteDialog({ isOpen: true, quizId: id, quizTitle: title });
  };
  const closeDelete = () => setDeleteDialog({ isOpen: false, quizId: null, quizTitle: '' });

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.quizId) return;
    try {
      await quizDataSource.deleteQuiz(deleteDialog.quizId);
      await loadQuizzes();
      closeDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort');
      closeDelete();
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
    <>
      <View style={styles.list}>
        {quizzes.map((quiz) => (
          <Card key={quiz.id} style={styles.quizCard}>
            <CardBody style={styles.quizBody}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              {quiz.description ? (
                <Text style={styles.quizDesc} numberOfLines={2}>{quiz.description}</Text>
              ) : null}
              <View style={styles.badges}>
                <Badge variant="info">{quiz.questions?.length ?? 0} frågor</Badge>
              </View>
            </CardBody>
            <CardFooter style={styles.quizFooter}>
              <Button
                variant="primary"
                size="sm"
                onPress={() => navigation.navigate('QuizPlay', { quizId: quiz.id })}
              >
                Spela
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onPress={() => navigation.navigate('QuizEdit', { quizId: quiz.id })}
              >
                Redigera
              </Button>
              <Button variant="danger" size="sm" onPress={() => openDelete(quiz.id, quiz.title)}>
                Ta bort
              </Button>
            </CardFooter>
          </Card>
        ))}
      </View>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Ta bort quiz"
        message={`Ta bort "${deleteDialog.quizTitle}"?`}
        confirmText="Ta bort"
        cancelText="Avbryt"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  error: { color: colors.red, padding: 16 },
  empty: { color: colors.gray500 },
  mt: { marginTop: 12 },
  list: { gap: 12 },
  quizCard: { marginBottom: 8 },
  quizBody: { padding: 12 },
  quizTitle: { fontSize: 16, fontWeight: '700', color: colors.gray900 },
  quizDesc: { fontSize: 14, color: colors.gray500, marginTop: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  quizFooter: { flexWrap: 'wrap', gap: 8, padding: 12 },
});
