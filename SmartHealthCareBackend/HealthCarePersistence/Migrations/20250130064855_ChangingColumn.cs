using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangingColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Slot",
                table: "BookAppointments");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                values: new object[] { "48edcbee-8d01-4b87-91ae-55cd254b8927", new DateTime(2025, 1, 30, 6, 33, 42, 616, DateTimeKind.Utc).AddTicks(652), "AQAAAAIAAYagAAAAEJVL3BDzs+d36824HtOK+N8xyG6kqm/c/jWG2CNmkJmKEcwtOgl6VxQNeR+rVKtlrQ==", "ec9a5281-3914-408f-920f-bc94e3899110", new DateTime(2025, 1, 30, 6, 33, 42, 616, DateTimeKind.Utc).AddTicks(663) });
        }
    }
}
