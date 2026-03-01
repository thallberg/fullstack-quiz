import type { ResultMessageStyle } from "../types/playQuiz.types"

type ResultMessages = {
  perfect: string;
  excellent: string;
  good: string;
  keepTrying: string;
  practice: string;
};

export function getResultMessage(
  percentage: number,
  msg: ResultMessages
): ResultMessageStyle {
  if (percentage === 100) {
    return {
      text: msg.perfect,
      color: "text-[var(--color-green)]",
      bgColor: "bg-gray-50",
      borderColor: "border-[var(--color-green)]/50",
    }
  }
  if (percentage >= 75) {
    return {
      text: msg.excellent,
      color: "text-green-text",
      bgColor: "bg-gray-50",
      borderColor: "border-[var(--color-green)]/50",
    }
  }
  if (percentage >= 50) {
    return {
      text: msg.good,
      color: "text-[var(--color-blue)]",
      bgColor: "bg-[var(--color-blue)]/10",
      borderColor: "border-[var(--color-blue)]/50",
    }
  }
  if (percentage >= 25) {
    return {
      text: msg.keepTrying,
      color: "text-[var(--color-yellow)]",
      bgColor: "bg-gray-50",
      borderColor: "border-[var(--color-yellow)]/50",
    }
  }
  return {
    text: msg.practice,
    color: "text-[var(--color-orange)]",
    bgColor: "bg-gray-50",
    borderColor: "border-[var(--color-orange)]/50",
  }
}
