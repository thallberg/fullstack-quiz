using backend.DTOs;

namespace backend.Services;

public interface IQuizResultService
{
    Task SubmitQuizResultAsync(SubmitQuizResultDto resultDto, int userId);
    Task<LeaderboardDto> GetLeaderboardAsync(int userId);
}
