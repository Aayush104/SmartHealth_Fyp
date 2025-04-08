using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class Videourl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "BookAppointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "a122df7b-6770-4939-8da2-8d16f477aa2b", new DateTime(2025, 4, 8, 9, 24, 2, 917, DateTimeKind.Utc).AddTicks(3306), "AQAAAAIAAYagAAAAEEyr3zLWqAJ93FVqbNjhCSKmaxkqfqTbZUIQ6cGGD+Xc4knk9CFDwWsyQkLB1GG+gw==", "426756a1-9939-4899-aa67-ab01b5c8a1aa", new DateTime(2025, 4, 8, 9, 24, 2, 917, DateTimeKind.Utc).AddTicks(3311) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "BookAppointments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "ff945d35-bff7-4556-a094-d9a61d546490", new DateTime(2025, 4, 7, 4, 41, 3, 614, DateTimeKind.Utc).AddTicks(4623), "AQAAAAIAAYagAAAAEK06K7xz93kmZsW8EoTTxOC1snlT+rp5CkVYzzhA5C4hrymfdayVPlMC/8v+M9vcbg==", "7c47a140-ea16-413c-83f1-d2779af4bd8f", new DateTime(2025, 4, 7, 4, 41, 3, 614, DateTimeKind.Utc).AddTicks(4630) });
        }
    }
}
