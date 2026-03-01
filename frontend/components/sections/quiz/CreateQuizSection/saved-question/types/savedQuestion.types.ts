import type { QuestionInput } from "../../create-quiz/types/quizTypes"

export interface SavedQuestionsListProps {
  questions: readonly QuestionInput[]
  onRemove: (id: string) => void
}

export interface SavedQuestionItemProps {
  question: QuestionInput
  index: number
  onRemove: (id: string) => void
}
