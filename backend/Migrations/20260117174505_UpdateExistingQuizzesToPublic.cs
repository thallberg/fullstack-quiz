using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExistingQuizzesToPublic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update all existing quizzes to be public by default
            migrationBuilder.Sql("UPDATE \"Quizzes\" SET \"IsPublic\" = true;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This migration doesn't need a down method as it's a data fix
        }
    }
}
