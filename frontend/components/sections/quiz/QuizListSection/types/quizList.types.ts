import type { GroupedQuizzesDto } from "@/api-types"
import type { ReactNode } from "react"

export type QuizGroupKey = keyof GroupedQuizzesDto

export interface QuizGroupConfig {
  key: QuizGroupKey
  title: string
  borderClass: string
  headerClass: string
  defaultOpen?: boolean
  icon: ReactNode
}

export interface DeleteDialogState {
  isOpen: boolean
  quizId: number | null
  quizTitle: string
}

export interface UseQuizDeleteReturn {
  deleteDialog: DeleteDialogState
  openDeleteDialog: (id: number, title: string) => void
  closeDeleteDialog: () => void
  confirmDelete: () => Promise<void>
}
