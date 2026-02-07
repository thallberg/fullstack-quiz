interface QuizErrorStateProps {
  message: string;
}

export function QuizErrorState({ message }: QuizErrorStateProps) {
  return (
    <div className="p-4 bg-gray-50 border border-[var(--color-red)] rounded-lg">
      <p className="text-[var(--color-red)]">{message}</p>
    </div>
  );
}
