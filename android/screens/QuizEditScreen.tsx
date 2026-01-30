import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { EditQuizSection } from '../components/sections/EditQuizSection';

type ParamList = { QuizEdit: { quizId: number } };

export function QuizEditScreen() {
  const route = useRoute<RouteProp<ParamList, 'QuizEdit'>>();
  const quizId = route.params?.quizId ?? 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <EditQuizSection quizId={quizId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
});
