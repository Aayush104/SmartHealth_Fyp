using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthCarePersistence.Migrations
{
    /// <inheritdoc />
    public partial class LastMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MarkAs",
                table: "Reports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "ff945d35-bff7-4556-a094-d9a61d546490", new DateTime(2025, 4, 7, 4, 41, 3, 614, DateTimeKind.Utc).AddTicks(4623), "AQAAAAIAAYagAAAAEK06K7xz93kmZsW8EoTTxOC1snlT+rp5CkVYzzhA5C4hrymfdayVPlMC/8v+M9vcbg==", "7c47a140-ea16-413c-83f1-d2779af4bd8f", new DateTime(2025, 4, 7, 4, 41, 3, 614, DateTimeKind.Utc).AddTicks(4630) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MarkAs",
                table: "Reports");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "25160704-4676-4ea0-8bf2-cffbfea196db",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp", "UpdatedAt" },
                values: new object[] { "876c1b94-6c08-4057-9cb4-dd54abadcff4", new DateTime(2025, 4, 2, 16, 6, 38, 806, DateTimeKind.Utc).AddTicks(7114), "AQAAAAIAAYagAAAAEBoo2tsITj/xuWsi8jmSgetlWMhTUOysoxXswm8pHoXALBPlv+/CRgP8/HKbpXBkSA==", "9c832683-6859-4984-8cf8-fe4fd87e5ebb", new DateTime(2025, 4, 2, 16, 6, 38, 806, DateTimeKind.Utc).AddTicks(7122) });
        }
    }
}
