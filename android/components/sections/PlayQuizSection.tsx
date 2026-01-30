import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { quizDataSource } from '../../lib/data';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';
import { Collapsible } from '../ui/Collapsible';
import { ResultPieChart } from './ResultPieChart';
import type { PlayQuizDto, QuizResponseDto } from '../../types';
import { colors } from '../../theme/colors';

interface PlayQuizSectionProps {
  quizId: number;
}

export function PlayQuizSection({ quizId }: PlayQuizSectionProps) {
  const navigation = useNavigation<any>();
  const [quiz, setQuiz] = useState<PlayQuizDto | null>(null);
  const [fullQuiz, setFullQuiz] = useState<QuizResponseDto | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const playData = await quizDataSource.playQuiz(quizId);
      const fullData = await quizDataSource.getQuizById(quizId);
      setQuiz(playData);
      setFullQuiz(fullData);
      const initial: Record<number, boolean> = {};
      playData.questions.forEach((q) => (initial[q.id] = false));
      setAnswers(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value: boolean) => {
    if (!quiz) return;
    const current = quiz.questions[currentIndex];
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResults(updated);
    }
  };

  const calculateResults = async (answersToUse?: Record<number, boolean>) => {
    if (!fullQuiz || !quiz) return;
    const check = answersToUse ?? answers;
    let correct = 0;
    let total = 0;
    quiz.questions.forEach((pq) => {
      const fq = fullQuiz.questions.find((q) => q.id === pq.id);
      if (fq) {
        total++;
        if (check[pq.id] === fq.correctAnswer) correct++;
      }
    });
    const finalTotal = total || quiz.questions.length;
    const percentage = Math.round((correct / finalTotal) * 100);
    setResults({ correct, total: finalTotal });

    try {
      await quizDataSource.submitQuizResult({
        quizId: quiz.id,
        score: correct,
        totalQuestions: finalTotal,
        percentage,
      });
    } catch {
      // ignore
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setResults(null);
    const initial: Record<number, boolean> = {};
    if (quiz) quiz.questions.forEach((q) => (initial[q.id] = false));
    setAnswers(initial);
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
  if (!quiz || !fullQuiz) return null;

  if (results !== null) {
    const percentage = Math.round((results.correct / results.total) * 100);
    let resultMsg = 'Bra jobbat!';
    let resultColor: string = colors.blue;
    if (percentage === 100) {
      resultMsg = 'Perfekt! Du fick alla rätt! 🎉';
      resultColor = colors.green;
    } else if (percentage >= 75) {
      resultMsg = 'Utmärkt jobbat! 🌟';
      resultColor = colors.green;
    } else if (percentage >= 50) {
      resultMsg = 'Bra jobbat! 👍';
    }

    return (
      <Card style={styles.card}>
        <CardHeader style={[styles.header, { backgroundColor: colors.green }]}>
          <Text style={styles.headerTitle}>Resultat</Text>
        </CardHeader>
        <CardBody style={styles.body}>
          <ResultPieChart correct={results.correct} total={results.total} size={200} />
          <Text style={styles.resultMsg}>{results.correct}/{results.total}</Text>
          <Text style={[styles.resultPct, { color: resultColor }]}>{percentage}% rätt</Text>
          <View style={styles.resultBox}>
            <Text style={[styles.resultText, { color: resultColor }]}>{resultMsg}</Text>
          </View>
          <Collapsible title="Se alla frågor och svar" defaultOpen headerBg={colors.blue}>
            {quiz.questions.map((pq, i) => {
              const fq = fullQuiz.questions.find((q) => q.id === pq.id);
              if (!fq) return null;
              const userAnswer = answers[pq.id];
              const isCorrect = userAnswer === fq.correctAnswer;
              return (
                <View key={pq.id} style={[styles.qaRow, isCorrect ? styles.qaCorrect : styles.qaWrong]}>
                  <View style={[styles.qaNum, isCorrect ? styles.qaNumCorrect : styles.qaNumWrong]}>
                    <Text style={styles.qaNumText}>{i + 1}</Text>
                  </View>
                  <View style={styles.qaContent}>
                    <Text style={styles.qaQuestion}>{fq.text}</Text>
                    <Text style={styles.qaLabel}>
                      Ditt svar: {userAnswer === undefined ? '–' : userAnswer ? 'Ja' : 'Nej'}
                      {userAnswer !== undefined && (isCorrect ? ' ✓' : ' ✗')}
                    </Text>
                    <Text style={styles.qaLabel}>Rätt svar: {fq.correctAnswer ? 'Ja' : 'Nej'}</Text>
                  </View>
                </View>
              );
            })}
          </Collapsible>
          <View style={styles.actions}>
            <Button onPress={() => navigation.navigate('Home')}>Tillbaka till alla quiz</Button>
            <Button variant="secondary" onPress={resetQuiz}>Spela igen</Button>
          </View>
        </CardBody>
      </Card>
    );
  }

  const current = quiz.questions[currentIndex];
  const questionNumber = currentIndex + 1;
  const totalQuestions = quiz.questions.length;

  return (
    <Card style={styles.card}>
      <CardHeader style={[styles.header, { backgroundColor: colors.blue }]}>
        <Text style={styles.headerTitle}>{quiz.title}</Text>
        <Text style={styles.badge}>Fråga {questionNumber} av {totalQuestions}</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <Label style={styles.questionText}>{current.text}</Label>
        <View style={styles.buttons}>
          <Button variant="primary" onPress={() => handleAnswer(true)} style={styles.half}>
            Ja
          </Button>
          <Button variant="danger" onPress={() => handleAnswer(false)} style={styles.half}>
            Nej
          </Button>
        </View>
      </CardBody>
    </Card>
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
  },
  errorText: { color: colors.red },
  card: { margin: 16 },
  header: { padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  badge: { fontSize: 12, color: colors.white, opacity: 0.9, marginTop: 4 },
  body: { padding: 20 },
  questionText: { fontSize: 18, marginBottom: 24, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  resultMsg: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  resultPct: { fontSize: 18, textAlign: 'center', marginTop: 4 },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.green + '80',
  },
  resultText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  actions: { marginTop: 24, gap: 12 },
  qaRow: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  qaCorrect: { backgroundColor: colors.gray50, borderColor: colors.green + '80' },
  qaWrong: { backgroundColor: colors.gray50, borderColor: colors.red + '80' },
  qaNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaNumCorrect: { backgroundColor: colors.green },
  qaNumWrong: { backgroundColor: colors.red },
  qaNumText: { fontSize: 14, fontWeight: '700', color: colors.white },
  qaContent: { flex: 1 },
  qaQuestion: { fontWeight: '600', color: colors.gray900, marginBottom: 4 },
  qaLabel: { fontSize: 12, color: colors.gray500 },
});
