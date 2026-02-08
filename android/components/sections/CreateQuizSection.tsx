import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import type { CreateQuestionDto } from '../../types';
import { colors } from '../../theme/colors';
import { useCreateQuizDraft } from '../../contexts/CreateQuizContext';

interface QuestionInput {
  id: string;
  text: string;
  correctAnswer: boolean;
}

export function CreateQuizSection() {
  const navigation = useNavigation<any>();
  const { savedQuestions, addQuestion, clearQuestions } = useCreateQuizDraft();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInput>({
    id: '',
    text: '',
    correctAnswer: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError('Frågetext är obligatorisk');
      return;
    }
    addQuestion({
      id: Date.now().toString(),
      text: currentQuestion.text.trim(),
      correctAnswer: currentQuestion.correctAnswer,
    });
    setCurrentQuestion({ id: '', text: '', correctAnswer: false });
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Titel är obligatorisk');
      return;
    }
    if (savedQuestions.length === 0) {
      setError('Du måste lägga till minst en fråga');
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
      await quizDataSource.createQuiz(dto);
      clearQuestions();
      setTitle('');
      setDescription('');
      setIsPublic(true);
      setCurrentQuestion({ id: '', text: '', correctAnswer: false });
      navigation.navigate('QuizList');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearQuestions();
    setTitle('');
    setDescription('');
    setIsPublic(true);
    setCurrentQuestion({ id: '', text: '', correctAnswer: false });
    setError('');
    navigation.goBack();
  };

  return (
    <Card style={styles.card}>
      <CardHeader style={[styles.header, { backgroundColor: colors.indigo }]}>
        <Text style={styles.headerTitle}>Skapa nytt Quiz</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <View style={styles.field}>
          <Label required>Titel</Label>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Ange quiz-titel"
          />
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
        <View style={styles.savedSummary}>
          <View style={styles.savedSummaryText}>
            <Text style={styles.savedTitle}>Sparade frågor</Text>
            <Text style={styles.savedSub}>
              {savedQuestions.length > 0
                ? `${savedQuestions.length} frågor sparade`
                : 'Inga frågor sparade ännu'}
            </Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            disabled={savedQuestions.length === 0}
            onPress={() => navigation.navigate('SavedQuestions')}
          >
            Visa
          </Button>
        </View>
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
          <Button variant="outline" onPress={handleCancel} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button onPress={handleSubmit} isLoading={isSubmitting}>
            Skapa Quiz
          </Button>
        </View>
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderColor: colors.indigo + '80' },
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
  addSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 16,
  },
  savedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 16,
  },
  savedSummaryText: { flex: 1, paddingRight: 12 },
  savedTitle: { fontSize: 16, fontWeight: '600', color: colors.gray900 },
  savedSub: { fontSize: 13, color: colors.gray500, marginTop: 4 },
  jaNej: { flexDirection: 'row', gap: 8, marginTop: 8 },
  half: { flex: 1 },
  mt: { marginTop: 12 },
  errorText: { color: colors.red, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' },
});
