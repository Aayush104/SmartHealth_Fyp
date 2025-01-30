using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangingColumnss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsButtonEnabled",
                table: "BookAppointments");

            migrationBuilder.DropColumn(
                name: "SlotEndTime",
                table: "BookAppointments");

            migrationBuilder.DropColumn(
                name: "SlotStartTime",
                table: "BookAppointments");

            migrationBuilder.AddColumn<string>(
                name: "Slot",
                table: "BookAppointments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "e954f9d5-bd98-4686-80fe-478ccdd1ecdb", new DateTime(2025, 1, 30, 7, 12, 14, 362, DateTimeKind.Utc).AddTicks(676), "AQAAAAIAAYagAAAAEG2LoOciMmPyxX622q3UVInQ2KiOY3kMcV4jdrH28zbo5OuurGoiEjh76I2hZA4p9Q==", "8c8e4ca7-a3c1-4b2c-b7ee-3cfef909c22b", new DateTime(2025, 1, 30, 7, 12, 14, 362, DateTimeKind.Utc).AddTicks(682) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Slot",
                table: "BookAppointments");

            migrationBuilder.AddColumn<bool>(
                name: "IsButtonEnabled",
                table: "BookAppointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "SlotEndTime",
                table: "BookAppointments",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "SlotStartTime",
                table: "BookAppointments",
                type: "time",
                maxLength: 50,
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "23925de2-ddb7-410f-a10d-926244fbb61d", new DateTime(2025, 1, 30, 6, 48, 55, 186, DateTimeKind.Utc).AddTicks(48), "AQAAAAIAAYagAAAAEFIXB5LkzWdsYhQ1NPFOIeHbFvBq+yBh9MQN+lZq6BiaJDTTykbxXQoOkVDo9EcLwA==", "37d22448-50fd-434c-81d3-f2f473799fb4", new DateTime(2025, 1, 30, 6, 48, 55, 186, DateTimeKind.Utc).AddTicks(53) });
        }
    }
}
