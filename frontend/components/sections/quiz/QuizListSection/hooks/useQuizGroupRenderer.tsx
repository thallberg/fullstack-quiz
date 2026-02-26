import { Badge } from "@/components/ui/Badge";
import { QUIZ_GROUPS_CONFIG } from "../QuizList.config";
import { QuizGroup } from "../QuizGroup";
import { GroupedQuizzesDto, QuizResponseDto } from "@/api-types";

interface Props {
  groupedQuizzes: GroupedQuizzesDto;
  renderCard: (quiz: QuizResponseDto) => React.ReactNode;
}

export function QuizGroupsRenderer({
  groupedQuizzes,
  renderCard,
}: Props) {
  return (
    <div className="space-y-4">
      {QUIZ_GROUPS_CONFIG.map((group) => {
        const quizzes = groupedQuizzes[group.key] ?? [];

        return (
          <QuizGroup
            key={group.key}
            title={
              <span className="flex items-center gap-2">
                {group.title}
                <Badge variant="default" className="text-xs">
                  {quizzes.length} quiz
                </Badge>
              </span>
            }
            quizzes={quizzes}
            className={group.borderClass}
            headerClassName={group.headerClass}
            defaultOpen={group.defaultOpen ?? false}
            icon={group.icon}
            renderCard={renderCard}
          />
        );
      })}
    </div>
  );
}