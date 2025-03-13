using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MarkAs",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "b71412d1-350f-4a0b-bd18-220aab37c303", new DateTime(2025, 3, 13, 12, 48, 58, 528, DateTimeKind.Utc).AddTicks(7791), "AQAAAAIAAYagAAAAEJr59d0Qk+9h28vf9+pk+Rra9emBCprFmgwy5MwW3Bz41eEpSLjt1R7z7S9srysvvQ==", "448e3269-30b3-4514-8776-9a05347089d6", new DateTime(2025, 3, 13, 12, 48, 58, 528, DateTimeKind.Utc).AddTicks(7797) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MarkAs",
                table: "Comments");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "b6c7e120-058d-4690-97b6-fd3d085df78d", new DateTime(2025, 3, 9, 7, 4, 1, 597, DateTimeKind.Utc).AddTicks(9051), "AQAAAAIAAYagAAAAEKUt3HCqR4RIiAOOTgRiFhJQ/eld2Uh2PAr7xYleBVJg5QWrdZUyAvDvp2riJHqF0A==", "fa927156-1cdb-4587-949a-66088018bb3f", new DateTime(2025, 3, 9, 7, 4, 1, 597, DateTimeKind.Utc).AddTicks(9060) });
        }
    }
}
