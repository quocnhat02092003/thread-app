using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thread_server.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnImagesInPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "Posts");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Posts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "Posts");

            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "Posts",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
