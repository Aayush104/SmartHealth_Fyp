using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class Meetingid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MeetingId",
                table: "BookAppointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "313b3284-4f0d-4c32-95a7-e0a8a722e0fc", new DateTime(2025, 1, 31, 10, 40, 25, 812, DateTimeKind.Utc).AddTicks(6288), "AQAAAAIAAYagAAAAENzmlPDaud8hTa5hASFN39FYWxGszYXjN83RyuP6RuoZti3j/UNcQjFFZ4J2YD2/zQ==", "ee79dd1a-bbec-49fe-9322-2280ec81d05a", new DateTime(2025, 1, 31, 10, 40, 25, 812, DateTimeKind.Utc).AddTicks(6292) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "BookAppointments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "4e858fdb-76b9-447d-b1cd-047b4917443e", new DateTime(2025, 1, 30, 9, 6, 3, 840, DateTimeKind.Utc).AddTicks(8593), "AQAAAAIAAYagAAAAEJfvg1N/xcB8hGMOwlnSpTnYaz6bG/kixAkeAXxD0j0iI5tE4y18xD10GS+ELo0c0Q==", "3ae2778b-7580-431e-af6e-3a6aa85c563c", new DateTime(2025, 1, 30, 9, 6, 3, 840, DateTimeKind.Utc).AddTicks(8602) });
        }
    }
}
