import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import { Spinner } from '../ui/Spinner';
import type { CreateQuestionDto } from '../../types';
import { colors } from '../../theme/colors';

interface QuestionInput {
  id: string;
  text: string;
  correctAnswer: boolean;
}

interface EditQuizSectionProps {
  quizId: number;
}

export function EditQuizSection({ quizId }: EditQuizSectionProps) {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState<QuestionInput[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInput>({
    id: '',
    text: '',
    correctAnswer: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      setError('');
      const quiz = await quizDataSource.getQuizById(quizId);
      setTitle(quiz.title);
      setDescription(quiz.description ?? '');
      setIsPublic(quiz.isPublic ?? true);
      setSavedQuestions(
        (quiz.questions ?? []).map((q) => ({
          id: String(q.id ?? Date.now()),
          text: q.text,
          correctAnswer: q.correctAnswer,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError('Frågetext krävs');
      return;
    }
    setSavedQuestions([
      ...savedQuestions,
      {
        id: Date.now().toString(),
        text: currentQuestion.text.trim(),
        correctAnswer: currentQuestion.correctAnswer,
      },
    ]);
    setCurrentQuestion({ id: '', text: '', correctAnswer: false });
    setError('');
  };

  const removeQuestion = (id: string) => {
    setSavedQuestions(savedQuestions.filter((q) => q.id !== id));
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Titel krävs');
      return;
    }
    if (savedQuestions.length === 0) {
      setError('Minst en fråga krävs');
      return;
    }
    setIsSubmitting(true);
    try {
      const dto = {
        title: title.trim(),
        description: description.trim(),
        isPublic,
        questions: savedQuestions.map(
          (q): CreateQuestionDto => ({ text: q.text, correctAnswer: q.correctAnswer })
        ),
      };
      await quizDataSource.updateQuiz(quizId, dto);
      navigation.navigate('Profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar quiz...</Text>
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <CardHeader style={[styles.header, { backgroundColor: colors.indigo }]}>
        <Text style={styles.headerTitle}>Redigera Quiz</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <View style={styles.field}>
          <Label required>Titel</Label>
          <Input value={title} onChangeText={setTitle} placeholder="Quiz-titel" />
        </View>
        <View style={styles.field}>
          <Label>Beskrivning</Label>
          <Textarea
            value={description}
            onChangeText={setDescription}
            placeholder="Beskrivning (valfritt)"
          />
        </View>
        <View style={styles.switchRow}>
          <Label>Publikt quiz</Label>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>
        {savedQuestions.length > 0 ? (
          <View style={styles.savedSection}>
            <Text style={styles.sectionTitle}>Sparade frågor ({savedQuestions.length})</Text>
            {savedQuestions.map((q, i) => (
              <View key={q.id} style={styles.savedRow}>
                <Text style={styles.savedText}>
                  {i + 1}. {q.text} – Rätt: {q.correctAnswer ? 'Ja' : 'Nej'}
                </Text>
                <Button variant="danger" size="sm" onPress={() => removeQuestion(q.id)}>
                  Ta bort
                </Button>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.addSection}>
          <Label required>Lägg till fråga</Label>
          <Input
            value={currentQuestion.text}
            onChangeText={(t) => setCurrentQuestion({ ...currentQuestion, text: t })}
            placeholder="Frågetext"
          />
          <View style={styles.jaNej}>
            <Button
              variant={currentQuestion.correctAnswer ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: true })}
              style={styles.half}
            >
              Ja
            </Button>
            <Button
              variant={!currentQuestion.correctAnswer ? 'danger' : 'outline'}
              size="sm"
              onPress={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: false })}
              style={styles.half}
            >
              Nej
            </Button>
          </View>
          <Button variant="primary" onPress={saveQuestion} style={styles.mt}>
            Spara fråga
          </Button>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button variant="outline" onPress={() => navigation.goBack()} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button onPress={handleSubmit} isLoading={isSubmitting}>
            Spara quiz
          </Button>
        </View>
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  card: { margin: 16 },
  header: { padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  body: { padding: 20 },
  field: { marginBottom: 16 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  savedSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  savedText: { flex: 1, fontSize: 14, color: colors.gray700 },
  addSection: {
    padding: 16,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 16,
  },
  jaNej: { flexDirection: 'row', gap: 8, marginTop: 8 },
  half: { flex: 1 },
  mt: { marginTop: 12 },
  errorText: { color: colors.red, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' },
});
