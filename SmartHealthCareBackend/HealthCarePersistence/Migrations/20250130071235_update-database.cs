using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "f298f8ff-78b8-4d27-b2ad-2f9adc664d30", new DateTime(2025, 1, 30, 7, 12, 34, 597, DateTimeKind.Utc).AddTicks(1514), "AQAAAAIAAYagAAAAENewtf95TlbXn2/+qcTQAkAI2agl/r3/i2nfXfoh/JqHj2TGsOPr+mqlIlNYgcKe2A==", "d3b60663-c783-4c5d-bcf5-9c295cb927c9", new DateTime(2025, 1, 30, 7, 12, 34, 597, DateTimeKind.Utc).AddTicks(1521) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "e954f9d5-bd98-4686-80fe-478ccdd1ecdb", new DateTime(2025, 1, 30, 7, 12, 14, 362, DateTimeKind.Utc).AddTicks(676), "AQAAAAIAAYagAAAAEG2LoOciMmPyxX622q3UVInQ2KiOY3kMcV4jdrH28zbo5OuurGoiEjh76I2hZA4p9Q==", "8c8e4ca7-a3c1-4b2c-b7ee-3cfef909c22b", new DateTime(2025, 1, 30, 7, 12, 14, 362, DateTimeKind.Utc).AddTicks(682) });
        }
    }
}
