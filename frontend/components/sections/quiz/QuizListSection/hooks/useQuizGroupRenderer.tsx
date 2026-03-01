import { Badge } from "@/components/ui/Badge";
import { useQuizGroupsConfig } from "../utils/quizGroups.config";
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
  const quizGroupsConfig = useQuizGroupsConfig();

  return (
    <div className="space-y-4">
      {quizGroupsConfig.map((group) => {
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