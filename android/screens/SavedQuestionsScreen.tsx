import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { useCreateQuizDraft } from '../contexts/CreateQuizContext';
import { colors } from '../theme/colors';

export function SavedQuestionsScreen() {
  const navigation = useNavigation<any>();
  const { savedQuestions, removeQuestion } = useCreateQuizDraft();

  return (
    <ProtectedRoute onRedirectToLogin={() => navigation.replace('Login')}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sparade frågor</Text>
          <Text style={styles.subtitle}>Här ser du alla frågor du lagt till</Text>
        </View>
        <Button variant="outline" onPress={() => navigation.goBack()} style={styles.backButton}>
          Tillbaka till skapa quiz
        </Button>
        {savedQuestions.length === 0 ? (
          <Text style={styles.empty}>Inga frågor sparade ännu</Text>
        ) : (
          <View style={styles.list}>
            {savedQuestions.map((q, index) => (
              <Card key={q.id} style={styles.card}>
                <CardBody style={styles.cardBody}>
                  <Text style={styles.questionText}>
                    {index + 1}. {q.text}
                  </Text>
                  <Text style={styles.answerText}>Rätt svar: {q.correctAnswer ? 'Ja' : 'Nej'}</Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onPress={() => removeQuestion(q.id)}
                    style={styles.removeButton}
                  >
                    Ta bort
                  </Button>
                </CardBody>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 12, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.indigo, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.gray500, textAlign: 'center' },
  backButton: { width: '100%', marginTop: 4, marginBottom: 16 },
  empty: { textAlign: 'center', color: colors.gray500, marginTop: 24 },
  list: { gap: 12 },
  card: { borderColor: colors.indigo + '60' },
  cardBody: { padding: 16 },
  questionText: { fontSize: 16, fontWeight: '600', color: colors.gray900, marginBottom: 6 },
  answerText: { fontSize: 14, color: colors.gray500, marginBottom: 12 },
  removeButton: { alignSelf: 'flex-start' },
});
