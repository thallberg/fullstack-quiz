using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToQuiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Quizzes",
                type: "boolean",
                nullable: false,
                defaultValue: true);
            
            // Update all existing quizzes to be public by default
            migrationBuilder.Sql("UPDATE \"Quizzes\" SET \"IsPublic\" = true WHERE \"IsPublic\" = false;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Quizzes");
        }
    }
}
