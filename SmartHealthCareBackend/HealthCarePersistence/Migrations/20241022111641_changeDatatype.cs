using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class changeDatatype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBooked",
                table: "DoctorAvailabilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

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
                values: new object[] { "8b66d0d8-7423-4b15-84ae-37848613b001", new DateTime(2024, 10, 22, 11, 16, 39, 47, DateTimeKind.Utc).AddTicks(3858), "AQAAAAIAAYagAAAAEIrLpxZkhm20RX1VBFN0TJ3dx1k6vjxz1oV3LI2C7JwR52p4ObHPXsTWgNrzp6WwYA==", "7b28d09a-cc8a-4360-a91d-9ad7c4ffb1e7", new DateTime(2024, 10, 22, 11, 16, 39, 47, DateTimeKind.Utc).AddTicks(3866) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBooked",
                table: "DoctorAvailabilities");

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
    }
}
