import type { QuestionInput } from "../../create-quiz/types/quizTypes"

export interface NewQuestionFormProps {
  question: QuestionInput
  onUpdate: (field: "text" | "correctAnswer", value: string | boolean) => void
  onSave: () => void
  onClear: () => void
}

export interface BinaryToggleOption {
  label: string
  value: boolean
  activeClass: string
  inactiveClass: string
}

export interface BinaryToggleProps {
  value: boolean
  options: readonly BinaryToggleOption[]
  onChange: (value: boolean) => void
}
