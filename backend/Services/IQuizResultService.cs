using backend.DTOs;

namespace backend.Services;

public interface IQuizResultService
{
    Task SubmitQuizResultAsync(SubmitQuizResultDto resultDto, int userId);
    Task<LeaderboardDto> GetLeaderboardAsync(int userId);
    Task<MyLeaderboardDto> GetMyLeaderboardAsync(int userId);
    Task<QuizResultDetailsDto> GetQuizResultDetailsAsync(int resultId, int userId);
}
