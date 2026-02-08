import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { PlayQuizSection } from '../components/sections/PlayQuizSection';

type ParamList = { QuizPlay: { quizId: number } };

export function QuizPlayScreen() {
  const route = useRoute<RouteProp<ParamList, 'QuizPlay'>>();
  const quizId = route.params?.quizId ?? 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <PlayQuizSection quizId={quizId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { flexGrow: 1, padding: 16, paddingBottom: 32, justifyContent: 'center' },
});
