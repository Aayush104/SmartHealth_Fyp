using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class CommentTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HappyWith",
                table: "Comments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "8b55ee31-cb69-4515-9c69-052528ffb928", new DateTime(2025, 2, 11, 8, 52, 48, 389, DateTimeKind.Utc).AddTicks(8092), "AQAAAAIAAYagAAAAEIhS3LQwS/peL6fVciV8sxYLZMVqPJnuWrpDqZZrJKdAbyo3SzErXzIIccm2TFpptA==", "ac27266f-f9b8-46c7-8296-614f2b5a6fc5", new DateTime(2025, 2, 11, 8, 52, 48, 389, DateTimeKind.Utc).AddTicks(8098) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HappyWith",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "2a9a3f8d-2c54-4424-a9dd-8dc92cac027a", new DateTime(2025, 2, 11, 8, 9, 51, 426, DateTimeKind.Utc).AddTicks(1867), "AQAAAAIAAYagAAAAEIHaqVyHJ8jqe+p3IdbcUo8/HCgUWzpta2zoIPWnALtUAMpgUF77UaFF53LA4Aj8pA==", "11b652c9-ea4b-410d-8ce2-1fc1b9c92f9a", new DateTime(2025, 2, 11, 8, 9, 51, 426, DateTimeKind.Utc).AddTicks(1879) });
        }
    }
}
