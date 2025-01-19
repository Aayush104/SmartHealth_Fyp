using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeColumnName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Context",
                table: "Messages",
                newName: "MessageContent");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "5457d475-c6d0-426b-a2b6-4591766a6bdc", new DateTime(2025, 1, 19, 15, 5, 11, 386, DateTimeKind.Utc).AddTicks(182), "AQAAAAIAAYagAAAAEOzkjfEzNkDrYPP5RYhmbCwI6xf5vksYVachTXa/3HQIzQltSEHuH9A8F6xIi46wHQ==", "cf9ee882-29ec-42ff-994a-0fecee714eca", new DateTime(2025, 1, 19, 15, 5, 11, 386, DateTimeKind.Utc).AddTicks(189) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MessageContent",
                table: "Messages",
                newName: "Context");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "812c1bd7-d039-4d59-b0af-be31e7842dee", new DateTime(2025, 1, 19, 13, 1, 28, 670, DateTimeKind.Utc).AddTicks(6921), "AQAAAAIAAYagAAAAEFqpqCsRX3O3o7/nuX/eZ8ZkA5yww8txHBRwECmckXgZAmt+ckbNaLguPmpab6Ep9A==", "f1174b14-678d-46e2-8ee2-96c9bd74c962", new DateTime(2025, 1, 19, 13, 1, 28, 670, DateTimeKind.Utc).AddTicks(6928) });
        }
    }
}
