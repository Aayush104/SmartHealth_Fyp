using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class initialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Slot",
                table: "BookAppointments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<string>(
                name: "AppointmentDate",
                table: "BookAppointments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "f0cfd5fa-1c91-4767-b1f2-5a091970c787", new DateTime(2024, 10, 21, 16, 14, 1, 668, DateTimeKind.Utc).AddTicks(9135), "AQAAAAIAAYagAAAAEJffwCjGvQfeeSXvDt/+2l9MrP1dEA5CnX9TJ05j+tZjI/fttXuagKpA5PjmYQMZMA==", "553a9fad-35bc-48cd-b739-83fd0d99abc7", new DateTime(2024, 10, 21, 16, 14, 1, 668, DateTimeKind.Utc).AddTicks(9141) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Slot",
                table: "BookAppointments",
                type: "time",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AppointmentDate",
                table: "BookAppointments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "373b4e14-c370-4083-906c-ec51b38be3af", new DateTime(2024, 10, 21, 9, 12, 10, 739, DateTimeKind.Utc).AddTicks(7367), "AQAAAAIAAYagAAAAECa+O8jaUHDJ+l7f1DvotuaApCv20g8xgDqMNuExCYYknIthyWCvQ5PFWENScOec2Q==", "f701fcfb-5451-4382-be99-077074410760", new DateTime(2024, 10, 21, 9, 12, 10, 739, DateTimeKind.Utc).AddTicks(7372) });
        }
    }
}
