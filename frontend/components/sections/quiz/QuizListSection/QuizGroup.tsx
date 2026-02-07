import type { ReactNode } from 'react';
import { Collapsible } from '@/components/ui/Collapsible';
import type { QuizResponseDto } from '@/types';

interface QuizGroupProps {
  title: ReactNode;
  quizzes: QuizResponseDto[];
  className: string;
  headerClassName: string;
  defaultOpen: boolean;
  icon: ReactNode;
  renderCard: (quiz: QuizResponseDto) => ReactNode;
}

export function QuizGroup({
  title,
  quizzes,
  className,
  headerClassName,
  defaultOpen,
  icon,
  renderCard,
}: QuizGroupProps) {
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return null;
  }

  return (
    <Collapsible
      title={title}
      className={className}
      headerClassName={headerClassName}
      defaultOpen={defaultOpen}
      icon={icon}
    >
      <div className="space-y-4 sm:-mx-2 lg:-mx-4">
        {quizzes.map(renderCard)}
      </div>
    </Collapsible>
  );
}
