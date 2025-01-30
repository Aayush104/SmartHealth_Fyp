using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class EndTimeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EndTime",
                table: "BookAppointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "4e858fdb-76b9-447d-b1cd-047b4917443e", new DateTime(2025, 1, 30, 9, 6, 3, 840, DateTimeKind.Utc).AddTicks(8593), "AQAAAAIAAYagAAAAEJfvg1N/xcB8hGMOwlnSpTnYaz6bG/kixAkeAXxD0j0iI5tE4y18xD10GS+ELo0c0Q==", "3ae2778b-7580-431e-af6e-3a6aa85c563c", new DateTime(2025, 1, 30, 9, 6, 3, 840, DateTimeKind.Utc).AddTicks(8602) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "BookAppointments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "cfd6913c-fcb4-48d0-a900-a0d227e7f40b", new DateTime(2025, 1, 30, 7, 36, 9, 718, DateTimeKind.Utc).AddTicks(6017), "AQAAAAIAAYagAAAAEEuQlRXGE1x/3U2ra4lsgdLbkCds0Fedrbnmyv+r7qAkBjn+ytYnCb/fvrvKuA19/w==", "0a32fae9-e255-4b23-9803-9c4560e1a9eb", new DateTime(2025, 1, 30, 7, 36, 9, 718, DateTimeKind.Utc).AddTicks(6024) });
        }
    }
}
