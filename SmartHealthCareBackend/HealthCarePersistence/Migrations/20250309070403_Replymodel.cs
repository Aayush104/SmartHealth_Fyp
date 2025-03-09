using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class Replymodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Replies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReplyText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Replies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Replies_Comments_CommentId",
                        column: x => x.CommentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Replies_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "b6c7e120-058d-4690-97b6-fd3d085df78d", new DateTime(2025, 3, 9, 7, 4, 1, 597, DateTimeKind.Utc).AddTicks(9051), "AQAAAAIAAYagAAAAEKUt3HCqR4RIiAOOTgRiFhJQ/eld2Uh2PAr7xYleBVJg5QWrdZUyAvDvp2riJHqF0A==", "fa927156-1cdb-4587-949a-66088018bb3f", new DateTime(2025, 3, 9, 7, 4, 1, 597, DateTimeKind.Utc).AddTicks(9060) });

            migrationBuilder.CreateIndex(
                name: "IX_Replies_CommentId",
                table: "Replies",
                column: "CommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Replies_DoctorId",
                table: "Replies",
                column: "DoctorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Replies");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "8b55ee31-cb69-4515-9c69-052528ffb928", new DateTime(2025, 2, 11, 8, 52, 48, 389, DateTimeKind.Utc).AddTicks(8092), "AQAAAAIAAYagAAAAEIhS3LQwS/peL6fVciV8sxYLZMVqPJnuWrpDqZZrJKdAbyo3SzErXzIIccm2TFpptA==", "ac27266f-f9b8-46c7-8296-614f2b5a6fc5", new DateTime(2025, 2, 11, 8, 52, 48, 389, DateTimeKind.Utc).AddTicks(8098) });
        }
    }
}
