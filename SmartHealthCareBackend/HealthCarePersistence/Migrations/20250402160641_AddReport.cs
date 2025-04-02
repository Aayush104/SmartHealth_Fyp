using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Urgency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Photo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reports_AspNetUsers_UserId",
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
                values: new object[] { "876c1b94-6c08-4057-9cb4-dd54abadcff4", new DateTime(2025, 4, 2, 16, 6, 38, 806, DateTimeKind.Utc).AddTicks(7114), "AQAAAAIAAYagAAAAEBoo2tsITj/xuWsi8jmSgetlWMhTUOysoxXswm8pHoXALBPlv+/CRgP8/HKbpXBkSA==", "9c832683-6859-4984-8cf8-fe4fd87e5ebb", new DateTime(2025, 4, 2, 16, 6, 38, 806, DateTimeKind.Utc).AddTicks(7122) });

            migrationBuilder.CreateIndex(
                name: "IX_Reports_UserId",
                table: "Reports",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "d7cb6404-8ddb-4f16-a7f2-a31644eb1176", new DateTime(2025, 3, 29, 16, 35, 11, 701, DateTimeKind.Utc).AddTicks(2096), "AQAAAAIAAYagAAAAEMWA/dZ6joeJPlNbW8l4x6LyzPl/nfggq3fV7fW5paxuMT8/2rO7lQQCs+8L9GCcBQ==", "ff184d8a-f5a2-40a0-8bfe-a458d5474144", new DateTime(2025, 3, 29, 16, 35, 11, 701, DateTimeKind.Utc).AddTicks(2103) });
        }
    }
}
