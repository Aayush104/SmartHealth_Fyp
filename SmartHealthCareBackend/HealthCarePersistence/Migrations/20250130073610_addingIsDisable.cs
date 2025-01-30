using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class addingIsDisable : Migration
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
                values: new object[] { "cfd6913c-fcb4-48d0-a900-a0d227e7f40b", new DateTime(2025, 1, 30, 7, 36, 9, 718, DateTimeKind.Utc).AddTicks(6017), "AQAAAAIAAYagAAAAEEuQlRXGE1x/3U2ra4lsgdLbkCds0Fedrbnmyv+r7qAkBjn+ytYnCb/fvrvKuA19/w==", "0a32fae9-e255-4b23-9803-9c4560e1a9eb", new DateTime(2025, 1, 30, 7, 36, 9, 718, DateTimeKind.Utc).AddTicks(6024) });
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
                values: new object[] { "f298f8ff-78b8-4d27-b2ad-2f9adc664d30", new DateTime(2025, 1, 30, 7, 12, 34, 597, DateTimeKind.Utc).AddTicks(1514), "AQAAAAIAAYagAAAAENewtf95TlbXn2/+qcTQAkAI2agl/r3/i2nfXfoh/JqHj2TGsOPr+mqlIlNYgcKe2A==", "d3b60663-c783-4c5d-bcf5-9c295cb927c9", new DateTime(2025, 1, 30, 7, 12, 34, 597, DateTimeKind.Utc).AddTicks(1521) });
        }
    }
}
