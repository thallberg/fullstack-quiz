"use client";

import { useMemo } from "react";
import { useContent } from "@/contexts/LocaleContext";
import type { QuizGroupConfig } from "../types/quizList.types";

export function useQuizGroupsConfig(): QuizGroupConfig[] {
  const { QUIZ_GROUPS_TEXT } = useContent();
  return useMemo(
    () => [
      {
        key: "myQuizzes",
        title: QUIZ_GROUPS_TEXT.myQuizzes,
        borderClass: "border-[var(--color-blue)]/50",
        headerClass:
          "bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)]",
        defaultOpen: true,
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        key: "friendsQuizzes",
        title: QUIZ_GROUPS_TEXT.friendsQuizzes,
        borderClass: "border-[var(--color-green)]/50",
        headerClass:
          "bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)]",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857"
            />
          </svg>
        ),
      },
      {
        key: "publicQuizzes",
        title: QUIZ_GROUPS_TEXT.publicQuizzes,
        borderClass: "border-[var(--color-purple)]/50",
        headerClass:
          "bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)]",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292"
            />
          </svg>
        ),
      },
    ],
    [QUIZ_GROUPS_TEXT]
  );
}
