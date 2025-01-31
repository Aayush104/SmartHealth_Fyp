using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MeetingIdValidation",
                table: "BookAppointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "7bdf2d98-b42b-4dab-8ef2-c8400d3b7443", new DateTime(2025, 1, 31, 14, 17, 38, 715, DateTimeKind.Utc).AddTicks(1301), "AQAAAAIAAYagAAAAEH2nO5D1NzcfDPDeSaf6LEoVUytp4N1ioOwBAy0zqQpTzmtKmWTS40WtNS0f3sBLwQ==", "241fa273-fddd-4980-9ff9-c2dcc24ed086", new DateTime(2025, 1, 31, 14, 17, 38, 715, DateTimeKind.Utc).AddTicks(1306) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeetingIdValidation",
                table: "BookAppointments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "313b3284-4f0d-4c32-95a7-e0a8a722e0fc", new DateTime(2025, 1, 31, 10, 40, 25, 812, DateTimeKind.Utc).AddTicks(6288), "AQAAAAIAAYagAAAAENzmlPDaud8hTa5hASFN39FYWxGszYXjN83RyuP6RuoZti3j/UNcQjFFZ4J2YD2/zQ==", "ee79dd1a-bbec-49fe-9322-2280ec81d05a", new DateTime(2025, 1, 31, 10, 40, 25, 812, DateTimeKind.Utc).AddTicks(6292) });
        }
    }
}
