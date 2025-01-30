using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsButtonEnabled",
                table: "BookAppointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "48edcbee-8d01-4b87-91ae-55cd254b8927", new DateTime(2025, 1, 30, 6, 33, 42, 616, DateTimeKind.Utc).AddTicks(652), "AQAAAAIAAYagAAAAEJVL3BDzs+d36824HtOK+N8xyG6kqm/c/jWG2CNmkJmKEcwtOgl6VxQNeR+rVKtlrQ==", "ec9a5281-3914-408f-920f-bc94e3899110", new DateTime(2025, 1, 30, 6, 33, 42, 616, DateTimeKind.Utc).AddTicks(663) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsButtonEnabled",
                table: "BookAppointments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "5457d475-c6d0-426b-a2b6-4591766a6bdc", new DateTime(2025, 1, 19, 15, 5, 11, 386, DateTimeKind.Utc).AddTicks(182), "AQAAAAIAAYagAAAAEOzkjfEzNkDrYPP5RYhmbCwI6xf5vksYVachTXa/3HQIzQltSEHuH9A8F6xIi46wHQ==", "cf9ee882-29ec-42ff-994a-0fecee714eca", new DateTime(2025, 1, 19, 15, 5, 11, 386, DateTimeKind.Utc).AddTicks(189) });
        }
    }
}
