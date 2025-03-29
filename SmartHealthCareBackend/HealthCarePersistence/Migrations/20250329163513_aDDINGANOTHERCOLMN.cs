using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class aDDINGANOTHERCOLMN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Announces",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Announces",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsMarked",
                table: "Announces",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "d7cb6404-8ddb-4f16-a7f2-a31644eb1176", new DateTime(2025, 3, 29, 16, 35, 11, 701, DateTimeKind.Utc).AddTicks(2096), "AQAAAAIAAYagAAAAEMWA/dZ6joeJPlNbW8l4x6LyzPl/nfggq3fV7fW5paxuMT8/2rO7lQQCs+8L9GCcBQ==", "ff184d8a-f5a2-40a0-8bfe-a458d5474144", new DateTime(2025, 3, 29, 16, 35, 11, 701, DateTimeKind.Utc).AddTicks(2103) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMarked",
                table: "Announces");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Announces",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Announces",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "863464ec-dd1d-4386-97d7-fc79fe6d4e18", new DateTime(2025, 3, 26, 15, 20, 20, 878, DateTimeKind.Utc).AddTicks(448), "AQAAAAIAAYagAAAAECJ1f78IerukzXxSc+uO6BDoCBVtFScLs4Z4BqdIAqLoTRS3X5V7/04E0euVDuUKmA==", "fca4a1ec-dd85-49ba-8593-454a268bba87", new DateTime(2025, 3, 26, 15, 20, 20, 878, DateTimeKind.Utc).AddTicks(452) });
        }
    }
}
