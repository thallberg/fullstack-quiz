using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class EnsureAllQuizzesHaveIsPublic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure all quizzes have IsPublic = true (compatibility for old quizzes)
            migrationBuilder.Sql(@"
                UPDATE ""Quizzes""
                SET ""IsPublic"" = true
                WHERE ""IsPublic"" IS NULL OR ""IsPublic"" = false;
            ");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
