using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBlocked",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenRevokedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "IsBlocked", "PasswordHash", "SecurityStamp", "TokenRevokedAt", "UpdatedAt" },
                values: new object[] { "819977fa-76be-43a5-ab3e-849ed02305bf", new DateTime(2025, 3, 17, 4, 49, 56, 950, DateTimeKind.Utc).AddTicks(6534), false, "AQAAAAIAAYagAAAAEGomjnvW/XAsnx4fYm6XL/Cbi1k2+7ebenWasqXRX0xWHYhMg+QTSXPdMvHwqQ05Uw==", "801ebb4b-6a49-4dd6-b312-d6e23227eb76", null, new DateTime(2025, 3, 17, 4, 49, 56, 950, DateTimeKind.Utc).AddTicks(6543) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBlocked",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TokenRevokedAt",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "b71412d1-350f-4a0b-bd18-220aab37c303", new DateTime(2025, 3, 13, 12, 48, 58, 528, DateTimeKind.Utc).AddTicks(7791), "AQAAAAIAAYagAAAAEJr59d0Qk+9h28vf9+pk+Rra9emBCprFmgwy5MwW3Bz41eEpSLjt1R7z7S9srysvvQ==", "448e3269-30b3-4514-8776-9a05347089d6", new DateTime(2025, 3, 13, 12, 48, 58, 528, DateTimeKind.Utc).AddTicks(7797) });
        }
    }
}
