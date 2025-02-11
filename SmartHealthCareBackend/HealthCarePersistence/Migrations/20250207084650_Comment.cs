using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class Comment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VisitedFor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRecommended = table.Column<bool>(type: "bit", nullable: false),
                    ReviewText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    HappyWith = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "3220aeae-773d-4ab9-9bee-3c33bbff2bc4", new DateTime(2025, 2, 7, 8, 46, 47, 649, DateTimeKind.Utc).AddTicks(7571), "AQAAAAIAAYagAAAAEFGk17VDErT+JMhUtQmCxxibzvYvz+MznEQPD6fi9AlE8Gnt3cozBCT14K29Er7R0g==", "43d526f9-0fdd-4146-b361-f9beadc77921", new DateTime(2025, 2, 7, 8, 46, 47, 649, DateTimeKind.Utc).AddTicks(7578) });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7bdf2d98-b42b-4dab-8ef2-c8400d3b7443", new DateTime(2025, 1, 31, 14, 17, 38, 715, DateTimeKind.Utc).AddTicks(1301), "AQAAAAIAAYagAAAAEH2nO5D1NzcfDPDeSaf6LEoVUytp4N1ioOwBAy0zqQpTzmtKmWTS40WtNS0f3sBLwQ==", "241fa273-fddd-4980-9ff9-c2dcc24ed086", new DateTime(2025, 1, 31, 14, 17, 38, 715, DateTimeKind.Utc).AddTicks(1306) });
        }
    }
}
