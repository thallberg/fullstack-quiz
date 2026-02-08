import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
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
  const { savedQuestions, addQuestion, removeQuestion, clearQuestions } = useCreateQuizDraft();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic] = useState(true);
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
      setStep(1);
      setTitle('');
      setDescription('');
      setCurrentQuestion({ id: '', text: '', correctAnswer: false });
      navigation.navigate('QuizList');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    clearQuestions();
    setStep(1);
    setTitle('');
    setDescription('');
    setCurrentQuestion({ id: '', text: '', correctAnswer: false });
    setError('');
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetAll();
    navigation.goBack();
  };

  const handleStep1Continue = () => {
    setError('');
    if (!title.trim()) {
      setError('Titel är obligatorisk');
      return;
    }
    setStep(2);
  };

  const handleStep2Continue = () => {
    setError('');
    if (savedQuestions.length === 0) {
      setError('Du måste lägga till minst en fråga');
      return;
    }
    setStep(3);
  };

  return (
    <Card style={styles.card}>
      <CardHeader style={[styles.header, { backgroundColor: colors.indigo }]}>
        <Text style={styles.headerTitle}>
          {step === 1 ? 'Skapa nytt quiz' : step === 2 ? 'Lägg till frågor' : 'Sammanfattning'}
        </Text>
        <Text style={styles.headerStep}>Steg {step} av 3</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {step === 1 ? (
          <>
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
            <View style={styles.actionsColumn}>
              <Button variant="outline" size="lg" onPress={handleCancel} style={styles.actionButton}>
                Avbryt
              </Button>
              <Button size="lg" onPress={handleStep1Continue} style={styles.actionButton}>
                Fortsätt
              </Button>
            </View>
          </>
        ) : step === 2 ? (
          <>
            <View style={styles.stepIntro}>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.stepSubtitle}>Lägg till frågor och rätt svar</Text>
            </View>
            <View style={styles.savedList}>
              <Text style={styles.savedTitle}>Frågor ({savedQuestions.length})</Text>
              {savedQuestions.length === 0 ? (
                <Text style={styles.savedSub}>Inga frågor sparade ännu</Text>
              ) : (
                savedQuestions.map((q, i) => (
                  <View key={q.id} style={styles.savedRow}>
                    <Text style={styles.savedText}>
                      {i + 1}. {q.text} – Rätt: {q.correctAnswer ? 'Ja' : 'Nej'}
                    </Text>
                    <Button variant="danger" size="sm" onPress={() => removeQuestion(q.id)}>
                      Ta bort
                    </Button>
                  </View>
                ))
              )}
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
            <View style={styles.actionsColumn}>
              <Button variant="outline" size="lg" onPress={handleCancel} style={styles.actionButton}>
                Avbryt
              </Button>
              <Button size="lg" onPress={handleStep2Continue} style={styles.actionButton}>
                Fortsätt
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Quiz</Text>
              <Text style={styles.summaryLabel}>Titel</Text>
              <Text style={styles.summaryValue}>{title}</Text>
              <Text style={styles.summaryLabel}>Beskrivning</Text>
              <Text style={styles.summaryValue}>{description || 'Ingen beskrivning'}</Text>
              <Text style={styles.summaryLabel}>Frågor</Text>
              {savedQuestions.map((q, i) => (
                <Text key={q.id} style={styles.summaryQuestion}>
                  {i + 1}. {q.text} – Rätt: {q.correctAnswer ? 'Ja' : 'Nej'}
                </Text>
              ))}
            </View>
            <View style={styles.actionsColumn}>
              <Button
                variant="secondary"
                size="lg"
                onPress={() => {
                  setError('');
                  setStep(1);
                }}
                style={styles.actionButton}
              >
                Redigera
              </Button>
              <Button variant="outline" size="lg" onPress={handleCancel} style={styles.actionButton}>
                Avbryt
              </Button>
              <Button size="lg" onPress={handleSubmit} isLoading={isSubmitting} style={styles.actionButton}>
                Spara
              </Button>
            </View>
          </>
        )}
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderColor: colors.indigo + '80' },
  header: { padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerStep: { fontSize: 13, color: colors.white, opacity: 0.9, marginTop: 4 },
  body: { padding: 20 },
  field: { marginBottom: 16 },
  stepIntro: { alignItems: 'center', marginBottom: 16 },
  stepTitle: { fontSize: 20, fontWeight: '700', color: colors.gray900, textAlign: 'center' },
  stepSubtitle: { fontSize: 14, color: colors.gray500, marginTop: 4, textAlign: 'center' },
  addSection: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 16,
  },
  savedList: { marginBottom: 8 },
  savedTitle: { fontSize: 16, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  savedSub: { fontSize: 13, color: colors.gray500, marginBottom: 8 },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  savedText: { flex: 1, fontSize: 14, color: colors.gray700, marginRight: 12 },
  jaNej: { flexDirection: 'row', gap: 8, marginTop: 8 },
  half: { flex: 1 },
  mt: { marginTop: 12 },
  errorText: { color: colors.red, marginBottom: 12 },
  actionsColumn: { gap: 12, marginTop: 8 },
  actionButton: { width: '100%' },
  summaryBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: colors.gray900, marginBottom: 12 },
  summaryLabel: { fontSize: 12, color: colors.gray500, marginTop: 8 },
  summaryValue: { fontSize: 15, fontWeight: '600', color: colors.gray900, marginTop: 4 },
  summaryQuestion: { fontSize: 13, color: colors.gray700, marginTop: 6 },
});
