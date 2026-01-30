import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { quizDataSource } from '../../lib/data';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
import { Collapsible } from '../ui/Collapsible';
import type { QuizResponseDto, GroupedQuizzesDto } from '../../types';
import { colors } from '../../theme/colors';

export function QuizListSection() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [grouped, setGrouped] = useState<GroupedQuizzesDto>({
    myQuizzes: [],
    friendsQuizzes: [],
    publicQuizzes: [],
  });
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
      const data = await quizDataSource.getAllQuizzes();
      setGrouped({
        myQuizzes: data?.myQuizzes ?? [],
        friendsQuizzes: data?.friendsQuizzes ?? [],
        publicQuizzes: data?.publicQuizzes ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
      setGrouped({ myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: number, title: string) => {
    setDeleteDialog({ isOpen: true, quizId: id, quizTitle: title });
  };
  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, quizId: null, quizTitle: '' });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.quizId) return;
    try {
      await quizDataSource.deleteQuiz(deleteDialog.quizId);
      await loadQuizzes();
      closeDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort quiz');
      closeDeleteDialog();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderQuizCards = (quizzes: QuizResponseDto[]) => {
    if (!quizzes.length) return null;
    return quizzes.map((quiz) => {
      const isOwner = user?.id === quiz.userId;
      return (
        <Card key={quiz.id} style={[styles.quizCard, { borderColor: colors.blue + '80' }]}>
          <CardBody style={styles.quizBody}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            {quiz.description ? (
              <Text style={styles.quizDesc} numberOfLines={2}>{quiz.description}</Text>
            ) : null}
            <View style={styles.badges}>
              <Badge variant="info">
                {quiz.questions?.length ?? 0} frågor
              </Badge>
              {!isOwner && (
                <Badge variant="default">Skapad av {quiz.username}</Badge>
              )}
              <Badge variant="default">{formatDate(quiz.createdAt)}</Badge>
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
            {isOwner ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => navigation.navigate('QuizEdit', { quizId: quiz.id })}
                >
                  Redigera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onPress={() => openDeleteDialog(quiz.id, quiz.title)}
                >
                  Ta bort
                </Button>
              </>
            ) : null}
          </CardFooter>
        </Card>
      );
    });
  };

  const total =
    (grouped.myQuizzes?.length ?? 0) +
    (grouped.friendsQuizzes?.length ?? 0) +
    (grouped.publicQuizzes?.length ?? 0);

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
  if (total === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Inga quiz hittades</Text>
        {user ? (
          <Button variant="primary" onPress={() => navigation.navigate('Create')} style={styles.mt}>
            Skapa första quizet
          </Button>
        ) : null}
      </View>
    );
  }

  return (
    <>
      <View style={styles.sections}>
        {grouped.myQuizzes?.length ? (
          <Collapsible
            title={`Mina Quiz (${grouped.myQuizzes.length})`}
            defaultOpen
            headerBg={colors.blue}
          >
            {renderQuizCards(grouped.myQuizzes)}
          </Collapsible>
        ) : null}
        {grouped.friendsQuizzes?.length ? (
          <Collapsible
            title={`Quiz skapade av vänner (${grouped.friendsQuizzes.length})`}
            headerBg={colors.green}
          >
            {renderQuizCards(grouped.friendsQuizzes)}
          </Collapsible>
        ) : null}
        {grouped.publicQuizzes?.length ? (
          <Collapsible
            title={`Andra publika quiz (${grouped.publicQuizzes.length})`}
            defaultOpen={!grouped.myQuizzes?.length}
            headerBg={colors.purple}
          >
            {renderQuizCards(grouped.publicQuizzes)}
          </Collapsible>
        ) : null}
      </View>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Ta bort quiz"
        message={`Är du säker på att du vill ta bort "${deleteDialog.quizTitle}"?`}
        confirmText="Ta bort"
        cancelText="Avbryt"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
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
  sections: { gap: 12 },
  quizCard: { marginBottom: 12 },
  quizBody: { padding: 12 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: colors.gray900, marginBottom: 4 },
  quizDesc: { fontSize: 14, color: colors.gray500, marginBottom: 8 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quizFooter: { flexWrap: 'wrap', gap: 8, padding: 12 },
});
